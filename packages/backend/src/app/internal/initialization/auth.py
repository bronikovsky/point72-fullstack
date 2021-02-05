from flask_login import LoginManager
from app.auth.domain import User


def register_auth(app):
    login_manager = LoginManager()

    app.config.update(
        SESSION_COOKIE_SECURE=True,
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE='Lax',
    )

    @login_manager.user_loader
    def load_user(user_id):
        return User.find_by_id(user_id)

    login_manager.init_app(app)
