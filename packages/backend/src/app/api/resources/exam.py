from datetime import datetime
from flask_login import login_required
from flask_restful import Resource
from app.api.decorators import catch_invalid_request
from app.internal.initialization.database import session
from flask import request
from flask_login import current_user
from app.exam.domain import Exam, ExamSchema
from app.exam.domain import Question
from app.utilities.exceptions import InvalidRequest


class GetExamDataEndpoint(Resource):
    @login_required
    def get(self, exam_id):
        exam = session.query(Exam).filter_by(id=exam_id).first()

        return dict(data=ExamSchema().dump(exam))


class CreateExamEndpoint(Resource):
    @catch_invalid_request
    @login_required
    def post(self):
        try:
            data = request.get_json()
            question_ids = data['questions']
            display_mode = data['displayMode']

            # TODO: constants
            has_valid_ids = isinstance(question_ids, list) and 9 < len(question_ids) < 101
            has_valid_display_mode = display_mode in ['single', 'multiple', 'variable']
            if not has_valid_ids or not has_valid_display_mode:
                raise InvalidRequest

            questions = session.query(Question).filter(Question.id.in_(question_ids))
            exam = Exam(user_id=current_user.id, display_mode=display_mode, created_at=datetime.utcnow())
            exam.questions = questions.all()

            session.add(exam)
            session.commit()

            return dict(id=exam.id)
        except KeyError:
            raise InvalidRequest
