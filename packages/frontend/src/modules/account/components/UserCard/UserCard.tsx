import * as React from 'react';
import { Button, Typography } from '../../../ui';
import { msg } from '../../../localization';
import { SupervisorAccount } from '@material-ui/icons';
import { usePending } from '../../../common';
import { usePermission } from '../../../auth';
import { User } from '../../../auth';
import classes from './UserCard.module.scss';
import classnames from 'classnames';
import useDeleteUser from '../../hooks/useDeleteUser';

type Props = {
  data: User,
  onAfterDelete: (id: string) => void;
}

const UserCard = (props: Props): React.ReactElement => {
  const { onAfterDelete, data } = props;
  const { id, country, age, email, is_admin: admin, first_name: firstName, last_name: lastName } = data;
  const currentUserAdmin = usePermission(true);
  const [onDeleteUser, { pending }] = useDeleteUser(id);
  const [, setPending] = usePending();

  const onClickDelete = React.useCallback(async () => {
    setPending(true);
    await onDeleteUser();
    setPending(false);
    onAfterDelete(id);
  }, [id, onAfterDelete, onDeleteUser, setPending]);

  return (
    <div className={classes.root}>
      <div className={classes.heading}>
        <div className={classes.name}>
          <SupervisorAccount/>
          <Typography>
            {`${firstName} ${lastName}`}
          </Typography>
        </div>
        <Typography color={admin ? 'primary' : 'lighter'} className={classnames(classes.type, { [classes.admin]: admin })}>
          {admin ? msg('account.admin') : msg('account.regular')}
        </Typography>
      </div>
      <Typography className={classes.data}>
        <div>
          <span>{msg('account.email')}</span>
          <span>{email}</span>
        </div>
        <div>
          <span>{msg('account.age')}</span>
          <span>{age}</span>
        </div>
        <div>
          <span>{msg('account.country')}</span>
          <span>{country}</span>
        </div>
      </Typography>
      {currentUserAdmin && (
        <div className={classes.actions}>
          <Button fullWidth color={'error'} disabled={pending} variant={'embedded'} onClick={onClickDelete} condensed>
            {msg('actions.delete')}
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserCard;
