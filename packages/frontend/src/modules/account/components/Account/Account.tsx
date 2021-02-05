import * as React from 'react';
import { AccountCircle } from '@material-ui/icons';
import { Button, Container, Typography } from '../../../ui';
import { msg } from '../../../localization';
import { silent } from '../../../apiv2';
import { useAsyncEffect, usePending } from '../../../common';
import { User } from '../../../auth';
import classes from './Account.module.scss';
import classnames from 'classnames';
import debounce from 'debounce-promise';
import Filters from '../Filters';
import PageHeader from '../PageHeader';
import useFetchUsers from '../../hooks/useFetchUsers';
import UserCard from '../UserCard';

const Account = (): React.ReactElement => {
  const [fetchUsers, { error }] = useFetchUsers();
  const [users, setUsers] = React.useState<User[]>([]);
  const [pending, setPending] = usePending();
  const cursor = React.useRef<number>(-1);
  const total = React.useRef<number>(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _onFetchUsers = React.useCallback(debounce(silent(async (search?: string, country?: string, age?: number[]) => {
    const { data, cursor: c, total: t } = await fetchUsers({
      cursor: cursor.current,
      search: search || '',
      country: country || '',
      ageMin: age?.[0] || 0,
      ageMax: age?.[1] || 120,
    });

    setUsers(u => [...u, ...data]);
    cursor.current = c;
    total.current = t;
  }), 1000), [fetchUsers, setPending]);

  const onFetchUsers = React.useCallback(async (...args: Parameters<typeof _onFetchUsers>) => {
    setPending(true);
    await _onFetchUsers(...args);
    setPending(false);
  }, [_onFetchUsers, setPending]);

  useAsyncEffect(onFetchUsers, []);

  const onFiltersChange = React.useCallback((search?: string, country?: string, age?: number[]) => {
    cursor.current = -1;
    total.current = 0;
    setUsers([]);
    onFetchUsers(search, country, age);
  }, [onFetchUsers]);

  const onClickMore = React.useCallback(() => {
    onFetchUsers();
  }, [onFetchUsers]);

  const onAfterDelete = React.useCallback((id: string) => {
    setUsers(u => u.filter(s => s.id !== id));
  }, []);

  return (
    <Container topPadding className={classes.root}>
      <PageHeader title={msg('account.heading')} Icon={AccountCircle}/>
      <section>
        <div className={classes.title}>
          <Typography variant={'overline'} color={'lighter'}>
            {msg('account.users')}
          </Typography>
          <Typography variant={'overline'} color={'lighter'}>
            {msg('account.results', { total: total.current, count: users.length })}
          </Typography>
        </div>
        <Filters onChange={onFiltersChange}/>
        <div className={classnames(classes.activity, { [classes.error]: error })}>
          {!error ? users.map(u => (
            <div key={u.id}>
              <UserCard data={u} onAfterDelete={onAfterDelete}/>
            </div>
          )) : null}
          {error && (
            <Typography color={'error'}>
              {msg('form.errors.server_error')}
            </Typography>
          )}
          {!error && !pending && users.length === 0 && (
            <Typography color={'lighter'} className={classes.noResults}>
              {msg('account.no_results')}
            </Typography>
          )}
        </div>
        {(!error && cursor.current >= 0 && cursor.current < total.current && !pending) && (
          <Button
            variant={'embedded'}
            onClick={onClickMore}
            className={classes.fetchMore}
            disabled={pending}
          >
            {msg('account.fetch_more')}
          </Button>
        )}
      </section>
    </Container>
  );
};

export default Account;
