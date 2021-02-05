from flask_restful import Api
import app.auth.resources as auth


def register_routes(app):
    api = Api(app, catch_all_404s=True, prefix='/api')

    api.add_resource(auth.LoginEndpoint, '/auth/login')
    api.add_resource(auth.RegisterEndpoint, '/auth/register')
    api.add_resource(auth.LogoutEndpoint, '/auth/logout')
    api.add_resource(auth.VerifyEmailEndpoint, '/auth/verify_email')
    api.add_resource(auth.CurrentUserEndpoint, '/user/current')
    api.add_resource(auth.UsersEndpoint, '/users', '/users/<string:user_id>')
    api.add_resource(auth.DictionaryCountriesEndpoint, '/dictionary/countries')
