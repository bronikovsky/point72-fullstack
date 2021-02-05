from datetime import timezone

from flask import request
from flask_login import login_required, current_user
from flask_restful import Resource
from sqlalchemy import and_
from sqlalchemy.orm import aliased
from app.api.decorators import catch_invalid_request
from app.internal.initialization.database import session
from app.exam.domain import ExamQuestion, Exam, ExamSession, ExamSessionAnswer
from app.exam.domain import Answer
from app.exam.domain import Question
from app.authorization.domain import Username, User, UsernameSchema
from app.exam.domain import ExamSchema, ExamSessionSchema
from app.utilities.exceptions import InvalidRequest
from sqlalchemy import union, null, select
from marshmallow.utils import rfcformat, isoformat
from sqlalchemy import case, func
from app.utilities.response import error
from app.utilities.errors import USERNAME_TAKEN

PAGE_SIZE = 10


class GetStatsEndpoint(Resource):
    @login_required
    def get(self):
        correct_session_answers = (
            session.query(Answer)
                .join(Question)
                .join(ExamQuestion)
                .join(Exam)
                .join(ExamSession)
                .filter(and_(
                    Answer.correct.is_(True),
                    ExamSession.user_id == current_user.id,
                    ExamSession.submitted.is_(True)
                )).count()
        )

        user_correct_session_answers = (
            session.query(ExamSessionAnswer)
                .join(Answer)
                .join(ExamSession)
                .filter(and_(
                    Answer.correct.is_(True)),
                    ExamSession.user_id == current_user.id,
                    ExamSession.submitted.is_(True)
                ).count()
        )

        total_exam_sessions = (
            session.query(ExamSession).filter(ExamSession.user_id == current_user.id).count()
        )

        submitted_exam_sessions = (
            session.query(ExamSession)
                .filter(and_(
                    ExamSession.user_id == current_user.id,
                    ExamSession.submitted.is_(True)
                )).count()
        )

        answered_questions = (
            session.query(ExamSessionAnswer)
                .join(ExamSession)
                .filter(ExamSession.user_id == current_user.id)
                .count()
        )

        correct_answered_questions = (
            session.query(ExamSessionAnswer)
                .join(ExamSession)
                .join(Answer)
                .filter(and_(
                    ExamSession.user_id == current_user.id,
                    Answer.correct.is_(True)
                )).count()
        )

        return dict(
            correct_session_answers=correct_session_answers,
            user_correct_session_answers=user_correct_session_answers,
            total_exam_sessions=total_exam_sessions,
            submitted_exam_sessions=submitted_exam_sessions,
            answered_questions=answered_questions,
            correct_answered_questions=correct_answered_questions
        )


class GetActivityEndpoint(Resource):
    @login_required
    def get(self):
        max_row = request.args.get('maxRow')
        max_row = 0 if max_row is None else max_row

        exams = session.query(
            Exam.id.label('exam_id'),
            null().label('session_id'),
            Exam.created_at.label('date')
        ).filter(Exam.user_id == current_user.id)

        sessions = session.query(
            null().label('exam_id'),
            ExamSession.id.label('session_id'),
            case(
                [(ExamSession.submitted, ExamSession.submitted_at)],
                else_=ExamSession.created_at
            ).label('date')
        ).filter(ExamSession.user_id == current_user.id)

        queries = union(exams, sessions).alias()

        all_activity = session.execute(select([func.count().label('count_1')]).select_from(queries))
        total = all_activity.first().count_1
        del all_activity

        activity = select([
            func.row_number().over(order_by=queries.c.date.desc()).label('row_number'),
            queries.c.exam_id,
            queries.c.session_id,
            queries.c.date
        ])

        alias = activity.alias()
        activity = session.execute(
            select(['*'])
                .select_from(alias)
                .where(alias.c.row_number > max_row)
                .limit(PAGE_SIZE)
        )

        items = []
        last_activity = None
        for last_activity in activity:
            items.append(last_activity)

        if len(items) == 0:
            return dict(items=[], max_row=-1, total=0)

        exam_ids = [a.exam_id for a in items if a.exam_id is not None]
        exams = session.query(Exam).filter(Exam.id.in_(exam_ids)).all() if len(exam_ids) > 0 else []

        session_ids = [a.session_id for a in items if a.session_id is not None]

        sessions = session.query(ExamSession).filter(ExamSession.id.in_(session_ids)).all() \
            if len(session_ids) > 0 else []

        exam_schema = ExamSchema()
        session_schema = ExamSessionSchema()

        def dump(item):
            data = dict(date=item.date.replace(tzinfo=timezone.utc).isoformat(), row_number=item.row_number)
            if item.exam_id is not None:
                data.update(dict(
                    data=exam_schema.dump([e for e in exams if e.id == item.exam_id][0]),
                    type='exam_created'
                ))
            else:
                exam_session = [s for s in sessions if s.id == item.session_id][0]
                data.update(dict(
                    data=session_schema.dump(exam_session),
                    type='session_submitted' if exam_session.submitted else 'session_created'
                ))
            return data

        return dict(items=[dump(i) for i in items], max_row=last_activity.row_number, total=total)


class GetAvailableUsernamesEndpoint(Resource):
    @login_required
    def get(self):
        usernames_alias = aliased(Username)
        subquery = (
            select([func.count(1).label('count')])
                .select_from(User)
                .where(and_(
                    User.id != current_user.id,
                    User.username_id == usernames_alias.id
                ))
                .as_scalar()
        )

        usernames = session.query(usernames_alias).filter(subquery == 0).order_by(usernames_alias.content)
        schema = UsernameSchema()

        return [schema.dump(u) for u in usernames]


class ChangeUsernameEndpoint(Resource):
    @login_required
    @catch_invalid_request
    def post(self):
        data = request.get_json()
        username_id = data.get('usernameId')

        username = session.query(Username).filter(Username.id == username_id).first()
        if username is None:
            raise InvalidRequest

        is_taken = session.query(User).filter(User.username_id == username_id).first() is not None
        if is_taken:
            return error(USERNAME_TAKEN)

        current_user.username = username
        session.commit()
        return dict()
