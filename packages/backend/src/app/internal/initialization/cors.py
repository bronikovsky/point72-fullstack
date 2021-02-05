from flask_cors import CORS


def configure_cors(app):
    CORS(app, resources={
        '/api/*': {'origins': ['http://localhost:*']},
    }, supports_credentials=True)
