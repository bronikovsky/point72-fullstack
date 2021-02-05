import { RequestStatus, useRequest } from '../../apiv2';

type UseLogout = [
  () => Promise<void>,
  RequestStatus,
];

export default function useLogout(): UseLogout {
  const [logout, status] = useRequest<void>('/auth/logout', {
    credentials: 'include',
    method: 'POST',
    json: false,
  });

  return [logout, status];
}
