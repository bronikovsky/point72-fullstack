from sqlalchemy import text
from sqlalchemy.dialects.postgresql import UUID
from werkzeug.security import generate_password_hash, check_password_hash

from app.internal.initialization.database import db, session
from flask_login import UserMixin
from sqlalchemy.ext.hybrid import hybrid_property
from marshmallow import Schema
from marshmallow.fields import Str, Boolean, Integer, DateTime
from app.utilities.mixins import SearchMixin

DATETIME_FORMAT = '%Y-%m-%dT%H:%M:%S+00:00'


class Password:
    def __init__(self, value, skip_hashing=False):
        self._hash = value if skip_hashing else generate_password_hash(value)

    @staticmethod
    def from_string(value):
        return Password(value)

    @staticmethod
    def from_existing_hash(value):
        return Password(value, True)

    def __str__(self):
        return str(self._hash)


class User(db.Model, UserMixin, SearchMixin):
    __tablename__ = 'users'

    id = db.Column(UUID(), primary_key=True, server_default=text('uuid_generate_v4()'))
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Integer(), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(500), nullable=False)
    registered_at = db.Column(db.TIMESTAMP(), nullable=False)
    last_login_at = db.Column(db.TIMESTAMP())
    _password = db.Column('password', db.String(100))
    is_admin = db.Column(db.Boolean(), nullable=False, server_default=text('TRUE'))

    def can_login(self, password):
        return check_password_hash(self._password, password)

    @staticmethod
    def find_by_email(email):
        return session.query(User).filter(User.email == email).first()

    @hybrid_property
    def password(self):
        return self._password

    @password.setter
    def password(self, value):
        if isinstance(value, Password):
            self._password = str(value)
        else:
            self._password = str(Password.from_string(value))


class UserSchema(Schema):
    id = Str()
    email = Str()
    is_admin = Boolean()
    first_name = Str()
    last_name = Str()
    age = Integer()
    country = Str()
    registered_at = DateTime(format=DATETIME_FORMAT)
    last_login_at = DateTime(format=DATETIME_FORMAT)
