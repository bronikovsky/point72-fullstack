import logging
from flask import Flask
from app.internal.initialization.config import configure_app, Config
from app.internal.initialization.api import register_routes
from app.internal.initialization.gunicorn import GunicornApp
from app.internal.initialization.database import register_db, db
from app.internal.initialization.auth import register_auth
from app.internal.initialization.cors import configure_cors

app = Flask(__name__)
configure_app(app)
configure_cors(app)

register_routes(app)
register_db(app)
register_auth(app)

logging.basicConfig(level=logging.DEBUG)

if __name__ == '__main__':
    port = 8000
    host = '0.0.0.0'

    # This would be used in a production environment, which
    # is not configured for this repo.
    if Config.should_run_with_gunicorn():
        with app.app_context():
            db.engine.dispose()
        gunicorn_app = GunicornApp(app)
        gunicorn_app.run(
            worker_class='gunicorn.workers.gthread.ThreadWorker',
            accesslog='-',
            workers=2, threads=4,
            bind='{}:{}'.format(host, port)
        )
    else:
        app.run(host=host, port=port, debug=Config.is_debug(), threaded=True)
