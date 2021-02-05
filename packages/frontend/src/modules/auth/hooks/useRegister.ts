import * as React from 'react';
import { RegisterFormValues } from '../types';
import { RequestStatus, useRequest } from '../../apiv2';

type UseRegister = [
  (values: RegisterFormValues) => Promise<void>,
  RequestStatus,
];

export default function useRegister(): UseRegister {
  const [register, status] = useRequest<void>('/auth/register', {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    json: false,
  });

  const onRegister = React.useCallback((values: RegisterFormValues): Promise<void> => {
    return register(JSON.stringify({ ...values, country: values.country?.label }));
  }, [register]);

  return [onRegister, status];
}
