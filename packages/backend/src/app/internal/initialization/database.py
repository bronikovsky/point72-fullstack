from flask_migrate import Migrate, upgrade
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy(engine_options=dict(pool_pre_ping=True))
session = db.session


def register_db(app):
    db.init_app(app)
    Migrate(app, db)

    with app.app_context():
        upgrade(directory='/package-root/src/app/migrations')
