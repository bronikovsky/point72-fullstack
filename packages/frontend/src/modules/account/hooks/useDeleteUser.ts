import * as React from 'react';
import { RequestStatus, useRequest } from '../../apiv2';

type UseDeleteUser = [
  () => Promise<void>,
  RequestStatus,
];

export default function useDeleteUser(id: string): UseDeleteUser {
  const [deleteUser, status] = useRequest<void>(`/users/${id}`, {
    credentials: 'include',
    method: 'DELETE',
    json: false,
  });

  const onDeleteUser = React.useCallback(() => {
    return deleteUser();
  }, [deleteUser]);

  return [onDeleteUser, status];
}
