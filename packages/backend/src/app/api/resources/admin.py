from flask import request
from flask_login import current_user
from flask_restful import Resource
from sqlalchemy import or_
from app.admin.domain import QuestionGroup
from app.api.decorators import permission_required
from app.api.resources.common import invalid_request
from app.exam.domain import Answer
from app.exam.domain import Choice
from app.exam.domain import Question
from app.internal.initialization.database import session
from app.search.domain import Tag
from app.search.domain import TagAlias
from app.utilities.exceptions import InvalidRequest
from app.utilities.permissions import QUESTIONS
from app.authorization.service import has_permission
from app.search.service import SearchIndex


class SaveQuestionGroupEndpoint(Resource):
    @permission_required(QUESTIONS.CREATE)
    def post(self):
        try:
            data = request.get_json()
            name = data['name']
            questions = data['questions']
            admin_group = QuestionGroup(user_id=current_user.id, name=name)

            if session.query(QuestionGroup).filter_by(name=name).first() is not None:
                return dict(error=True, message='Ta nazwa zbioru jest już zajęta.')

            tags = process_tags(questions)
            questions = substitute_tags(questions, tags)

            for question in questions:
                qst = Question(content=question['content'], admin_group=admin_group)
                for tag in question['tags']:
                    qst.tags.append(tag)
                for answer in question['answers']:
                    qst.answers.append(Answer(content=answer['content'], correct=answer['correct']))
                for choice in question['choices']:
                    qst.choices.append(Choice(identifier=choice['identifier'], content=choice['content']))
                session.add(qst)

            session.commit()

            SearchIndex.register_questions(admin_group.questions)

            return dict()
        except KeyError:
            return invalid_request()


class UpdateQuestionGroupEndpoint(Resource):
    @permission_required([QUESTIONS.EDIT, QUESTIONS.EDIT_OWNED])
    def post(self):
        data = request.get_json()
        name = data['name']
        questions = data['questions']

        admin_group = session.query(QuestionGroup).filter_by(name=name).first()

        can_edit, reason = can_edit_admin_group(admin_group)
        if not can_edit:
            return reason

        tags = process_tags(questions)
        questions = substitute_tags(questions, tags)

        for question in questions:
            update_question_in_db(question, admin_group)

        session.commit()
        return dict()


# @deprecated
class UpdateQuestionEndpoint(Resource):
    @permission_required([QUESTIONS.EDIT, QUESTIONS.EDIT_OWNED])
    def post(self):
        data = request.get_json()
        question = data['question']

        db_question = session.query(Question).get(question['id'])
        admin_group = session.query(QuestionGroup).get(db_question.admin_group_id)

        can_edit, reason = can_edit_admin_group(admin_group)
        if not can_edit:
            return reason

        tags = process_tags([question])

        questions = substitute_tags([question], tags)

        for question in questions:
            update_question_in_db(question, admin_group)

        # SearchIndex.rebulid_for_tags([t.id for t in db_question.tags])
        session.commit()
        return dict()


class CheckAdminGroupNameEndpoint(Resource):
    @permission_required(QUESTIONS.CREATE)
    def post(self):
        name = request.get_json()['name']
        group = session.query(QuestionGroup).filter_by(name=name).first()
        if group is None:
            return dict()

        return dict(error=True, message='Zbiór o takiej nazwie już istnieje.')


def process_tags(questions):
    question_tags = [q['tags'] for q in questions]
    unique_tags = list(set([tag['name'] for tag_list in question_tags for tag in tag_list]))
    tags = session.query(Tag).filter(or_(
        Tag.name.in_(unique_tags),
        Tag.aliases.any(TagAlias.name.in_(unique_tags))
    )).all()
    new_tags = []
    for t in unique_tags:
        exists = False
        for tag in tags:
            if t == tag.name:
                exists = True
            if t in [a.name for a in tag.aliases]:
                exists = True
        if not exists:
            tg = Tag(name=t)
            new_tags.append(tg)
    return tags + new_tags


def substitute_tags(questions, tags):
    tags_lookup = dict()
    for tag in tags:
        tags_lookup[tag.name] = tag
        for alias in tag.aliases:
            tags_lookup[alias.name] = tag

    for question in questions:
        tags = list(set([tags_lookup[tag['name']] for tag in question['tags']]))
        question['tags'] = tags

    return questions


def update_question_in_db(question, admin_group):
    db_question = [q for q in admin_group.questions if q.id == question['id']][0]
    db_question.content = question['content']
    existing_tags_to_keep = list(set(db_question.tags) & set(question['tags']))
    new_tags = [t for t in question['tags'] if t not in existing_tags_to_keep]
    for tag in db_question.tags:
        if tag not in existing_tags_to_keep:
            db_question.tags.remove(tag)
    for tag in new_tags:
        db_question.tags.append(tag)

    if len(question['answers']) == 0:
        raise InvalidRequest

    for db_answer in db_question.answers:
        corrected_answer_candidate = [a for a in question['answers'] if db_answer.id == a['id']]
        if len(corrected_answer_candidate) == 0:
            db_question.answers.remove(db_answer)
            session.delete(db_answer)
            continue
        corrected_answer = corrected_answer_candidate[0]
        db_answer.correct = corrected_answer['correct']
        db_answer.content = corrected_answer['content']

    new_answers = [a for a in question['answers'] if a['id'] is None]
    for answer in new_answers:
        new_db_answer = Answer(content=answer['content'], correct=answer['correct'])
        db_question.answers.append(new_db_answer)

    for db_choice in db_question.choices:
        corrected_choice_candidate = [c for c in question['choices'] if db_choice.id == c['id']]
        if len(corrected_choice_candidate) == 0:
            db_question.choices.remove(db_choice)
            session.delete(db_choice)
            continue
        corrected_choice = corrected_choice_candidate[0]
        db_answer.content = corrected_choice['content']
        db_answer.identifier = corrected_choice['identifier']

    new_choices = [c for c in question['choices'] if c['id'] is None]
    for choice in new_choices:
        new_db_choice = Choice(content=choice['content'], identifier=choice['identifier'])
        db_question.choices.append(new_db_choice)


def can_edit_admin_group(admin_group):
    if admin_group is None:
        return False, dict(error=True, message='Ten zbiór nie istnieje.')

    if not has_permission(current_user, QUESTIONS.EDIT) and not admin_group.user_id == current_user.id:
        return False, (None, 401)

    return True, None
