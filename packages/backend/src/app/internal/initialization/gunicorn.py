from gunicorn.app.base import Application, Config


class GunicornApp(Application):
    def __init__(self, app):
        Application.__init__(self)
        self.cfg = None
        self.log = None
        self.app = app

    def init(self, parser, opts, args):
        pass

    def load(self):
        return self.app

    def run(self, **options):
        self.cfg = Config()
        for key, value in options.items():
            self.cfg.set(key, value)

        return Application.run(self)
