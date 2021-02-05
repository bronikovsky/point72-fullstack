from datetime import datetime

import pycountry
from flask import request
from flask_login import login_required, login_user, logout_user
from flask_login import current_user
from flask_restful import Resource
from sqlalchemy import and_, or_
from validate_email import validate_email
from werkzeug.exceptions import BadRequest, NotFound

from ..utilities.query import PagedQuery
from ..utilities.decorators import admin_required
from ..internal.initialization.database import session
from .domain import Password
from .domain import UserSchema
from .domain import User

countries = [c.name for c in list(pycountry.countries)]


class RegisterEndpoint(Resource):
    @staticmethod
    def post():
        try:
            data = request.get_json()
            email = data['email']
            password = data['password']
            password_confirm = data['passwordConfirm']
            account_type = data['accountType']
            first_name = data['firstName']
            last_name = data['lastName']
            age = data['age']
            country = data['country']
        except (BadRequest, KeyError) as e:
            raise BadRequest('invalid_data') from e

        if password != password_confirm:
            raise BadRequest('passwords_must_match')

        if account_type not in ['admin', 'regular']:
            raise BadRequest('invalid_account_type')

        if country not in countries:
            raise BadRequest('invalid_country')

        try:
            if not (0 < int(age) <= 120):
                raise BadRequest('invalid_age')
        except ValueError as e:
            raise BadRequest('invalid_age') from e

        if not first_name:
            raise BadRequest('invalid_first_name')

        if not last_name:
            raise BadRequest('invalid_last_name')

        if not validate_email(email_address=email, check_regex=True, check_mx=False):
            raise BadRequest('invalid_email')

        user = User(
            email=email,
            is_admin=account_type == 'admin',
            registered_at=datetime.utcnow(),
            first_name=first_name,
            last_name=last_name,
            age=int(age),
            country=country,
        )
        user.password = Password(password)

        session.add(user)
        session.commit()


class LoginEndpoint(Resource):
    @staticmethod
    def post():
        try:
            data = request.get_json()
            email = data['email']
            password = data['password']
        except (BadRequest, KeyError) as e:
            raise BadRequest('invalid_data') from e

        user = User.find_by_email(email)

        if user is None or not user.can_login(password):
            raise BadRequest('invalid_credentials')

        login_user(user, remember=True)
        user.last_login_at = datetime.utcnow()
        session.commit()


class LogoutEndpoint(Resource):
    @staticmethod
    def post():
        logout_user()


class DictionaryCountriesEndpoint(Resource):
    def get(self):
        return countries


class VerifyEmailEndpoint(Resource):
    def post(self):
        try:
            data = request.get_json()
            email = data['email']
        except (BadRequest, KeyError) as e:
            raise BadRequest('invalid_data') from e

        if not email:
            raise BadRequest('invalid_data')

        if not validate_email(email_address=email, check_regex=True, check_mx=False):
            return dict(valid=False, message='invalid_format')

        user = User.find_by_email(email)

        if user is not None:
            return dict(valid=False, message='taken')

        return dict(valid=True)


class CurrentUserEndpoint(Resource):
    @login_required
    def get(self):
        return UserSchema().dump(current_user)


class UsersEndpoint(Resource):
    @login_required
    def get(self, user_id=None):
        schema = UserSchema()

        if user_id is None:
            cursor = int(request.args.get('cursor', '0'))
            cursor = 0 if cursor < 0 else cursor

            search = request.args.get('search', '')
            country = request.args.get('country', '')
            age_min = int(request.args.get('ageMin', '0'))
            age_max = int(request.args.get('ageMax', '120'))

            query = session.query(User)\
                .filter(User.id != current_user.id)\

            if search:
                filter = '%{}%'.format(search)

                query = query.filter(or_(
                    User.first_name.like(filter),
                    User.last_name.like(filter),
                    User.email.like(filter)
                ))

            if country:
                query = query.filter(User.country == country)

            if age_min and age_max:
                query = query.filter(and_(
                    User.age >= age_min,
                    User.age <= age_max,
                ))

            subquery = query.subquery()

            query = PagedQuery(
                order_by=subquery.c.id,
                query_alias=subquery,
                cursor=cursor
            )
            data = [schema.dump(u) for u in query]

            return dict(data=data, cursor=cursor + len(data), total=query.get_total())

        user = User.find_by_id(user_id)
        if user is None:
            raise NotFound

        return schema.dump(user)

    @admin_required
    def delete(self, user_id):
        user = User.find_by_id(user_id)

        session.delete(user)
        session.commit()
