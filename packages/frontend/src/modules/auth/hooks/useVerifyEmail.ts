import * as React from 'react';
import { RequestStatus, useRequest } from '../../apiv2';

type Result = {
  valid: boolean;
  message?: string;
}

type UseVerifyEmail = [
  (email: string) => Promise<string | undefined>,
  RequestStatus,
];

export default function useVerifyEmail(): UseVerifyEmail {
  const [verifyEmail, status] = useRequest<Result>('/auth/verify_email', {
    credentials: 'include',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  });

  const onVerifyEmail = React.useCallback(async (email: string): Promise<string | undefined> => {
    const result = await verifyEmail(JSON.stringify({ email }));

    return result.valid ? undefined : result.message;
  }, [verifyEmail]);

  return [onVerifyEmail, status];
}
