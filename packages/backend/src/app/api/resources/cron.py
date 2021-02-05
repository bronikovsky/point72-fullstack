from flask_restful import Resource
from flask import request
from app.authorization.domain import User
from app.internal.initialization.config import Config
from app.internal.initialization.database import session


class CronEndpoint(Resource):
    @staticmethod
    def reset_verification_code_attempts():
        for user in session.query(User):
            user.verification_attempts = 0
            user.password_reset_code = None
            user.password_reset_attempts = 0
            session.commit()

    def post(self):
        action_name = ''
        code = request.headers.get('X-Cron-Api-Code')
        if code is None or code != Config.INTERNAL_REQUEST_KEY:
            return dict(error='Invalid request.')
        try:
            print(request.get_json())
            action_name = request.get_json()['action']
            print(action_name)
            getattr(CronEndpoint, action_name)()
            return dict()
        except (KeyError, TypeError):
            return dict(error='Action not specified.')
        except AttributeError:
            return dict(error='Action \'' + action_name + '\' does not exist')



