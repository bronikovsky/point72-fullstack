from sqlalchemy import select, func

from ..internal.initialization.database import session


class PagedQuery:
    base_query = None
    count_query = None

    def __init__(self, order_by, query_alias=None, partition_by=None, page_size=10, cursor=0):
        numbered_query = select([
            func.row_number().over(
                order_by=order_by,
                partition_by=partition_by
            ).label('rn'),
            *[
                getattr(query_alias.c, attr)
                for attr in dir(query_alias.c)
                if not attr.startswith('_')
            ]
        ]).alias(name='paged_query')

        self.base_query = select(['*']) \
            .select_from(numbered_query) \
            .where(numbered_query.c.rn > cursor) \
            .limit(page_size)

        self.count_query = select([func.count()]) \
            .select_from(numbered_query)

    def get_total(self):
        total, = session.execute(self.count_query).first()

        return total

    def __iter__(self):
        return session.execute(self.base_query)
