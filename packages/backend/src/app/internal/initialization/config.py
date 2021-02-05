from os import environ


class Config:
    ENV = environ['POINT72_ENV']

    DB_URI = environ['DB_URI']

    SECRET_KEY = environ['SECRET_KEY']

    @staticmethod
    def is_development():
        return Config.ENV == 'development'

    @staticmethod
    def is_production():
        return Config.ENV == 'production'

    @staticmethod
    def is_debug():
        return Config.is_development()

    @staticmethod
    def should_run_with_gunicorn():
        return Config.is_production()


def validate_config():
    message = 'Invalid config entry for {} - {}'

    if Config.ENV not in ['development', 'production']:
        raise ValueError(message.format('ENV', Config.ENV))


def configure_app(app):
    validate_config()

    app.secret_key = bytes(Config.SECRET_KEY, encoding='utf-8')
    app.config['SQLALCHEMY_DATABASE_URI'] = Config.DB_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
