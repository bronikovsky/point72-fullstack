from flask_login import current_user, login_required
from werkzeug.exceptions import Unauthorized


def admin_required(fn):
    @login_required
    def wrapper(*args, **kwargs):
        if not current_user.is_admin:
            raise Unauthorized()
        return fn(*args, **kwargs)

    return wrapper
