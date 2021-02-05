from typing import Union
from app.internal.initialization.database import session


class SearchMixin:
    @classmethod
    def find_by_id(cls, object_id: Union[list, int], only_query=False):
        if not hasattr(cls, 'id'):
            raise AttributeError('{} does not have an id attribute.'.format(cls.__name__))
        is_list = isinstance(object_id, list)
        query = session.query(cls)
        query = query.filter(cls.id.in_(object_id)) if is_list else query.filter_by(id=object_id)
        if only_query:
            return query
        return query.all() if is_list else query.first()

    @classmethod
    def get_all(cls, only_query=True):
        data = session.query(cls)
        return data if only_query else data.all()
