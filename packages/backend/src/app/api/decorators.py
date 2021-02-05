import traceback
from typing import Union
from flask_login import login_required
from flask_login import current_user
from werkzeug.exceptions import BadRequest
from app.utilities.exceptions import InvalidRequest
from app.utilities.response import error
from app.authorization.service import has_permission


def permission_required(permission: Union[list, str]):
    def decorator(func):
        @login_required
        def wrapper(*args, **kwargs):
            can_access = False
            for p in permission if isinstance(permission, list) else [permission]:
                if has_permission(current_user, p):
                    can_access = True

            if not can_access:
                return None, 401

            return func(*args, **kwargs)

        return wrapper

    return decorator


def _catch_invalid_request(error_message=None, should_raise_exception=True):
    def decorator(func):
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except (InvalidRequest, BadRequest):
                traceback.print_exc()
                status = 500 if should_raise_exception else 200
                return error(error_message), status

        return wrapper

    return decorator


def custom_invalid_request(message: str = None):
    return _catch_invalid_request(message, False)


catch_invalid_request = _catch_invalid_request()
