from flask_restful import Resource


class VersionEndpoint(Resource):
    def get(self):
        return {
            'version': '1.0.0'
        }
