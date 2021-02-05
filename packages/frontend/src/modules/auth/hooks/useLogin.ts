import * as React from 'react';
import { LoginFormValues } from '../types';
import { RequestStatus, useRequest } from '../../apiv2';

type UseLogin = [
  (values: LoginFormValues) => Promise<void>,
  RequestStatus,
];

export default function useLogin(): UseLogin {
  const [login, status] = useRequest<void>('/auth/login', {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    json: false,
  });

  const onLogin = React.useCallback((values: LoginFormValues): Promise<void> => {
    return login(JSON.stringify(values));
  }, [login]);

  return [onLogin, status];
}
