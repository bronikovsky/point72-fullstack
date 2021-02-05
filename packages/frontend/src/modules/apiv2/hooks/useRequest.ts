import * as React from 'react';
import { ApiError } from '../lib/errors';
import request from '../lib/request';

export type RequestStatus = {
  pending: boolean;
  fetched: boolean;
  error: null | ApiError;
}

type RequestConfig<T extends RequestMethod = RequestMethod> = Omit<RequestInit, 'method'> & {
  method: T;
  json?: boolean;
}

type RequestArgs<T extends RequestMethod> =
  T extends Get ? [{ [key: string]: any }?] :
    T extends Patch | Post ? [any?] :
      T extends Delete ? [] : never

type UseRequest<T, S extends RequestMethod> = [
  (...args: RequestArgs<S>) => Promise<T>,
  RequestStatus,
]

type Get = 'GET' |  'get'
type Post = 'POST' | 'post'
type Patch = 'PATCH' | 'patch'
type Delete = 'DELETE' | 'delete'

type RequestMethod = Get | Patch | Post | Delete

export default function useRequest<T>(url: string, config: RequestConfig<Get>): UseRequest<T, Get>;
export default function useRequest<T>(url: string, config: RequestConfig<Post>): UseRequest<T, Post>;
export default function useRequest<T>(url: string, config: RequestConfig<Patch>): UseRequest<T, Patch>;
export default function useRequest<T>(url: string, config: RequestConfig<Delete>): UseRequest<T, Delete>;
export default function useRequest<T, S extends RequestMethod>(url: string, config: RequestConfig<S>): UseRequest<T, S> {
  const [error, setError] = React.useState<ApiError | null>(null);
  const [pending, setPending] = React.useState<boolean>(false);
  const [fetched, setFetched] = React.useState<boolean>(false);

  const getConfig = React.useCallback((...args: RequestArgs<S>): RequestConfig & { url: string } => {
    const { method, json = true } = config;
    const requestInit = { ...config, json, url };

    if (args[0]) {
      switch (method.toLowerCase()) {
        case 'get':
          const params = Object.keys(args[0]).reduce((all, k) => `${all}&${k}=${encodeURIComponent(args[0][k])}`, '');

          requestInit.url = `${url}?${params.substr(1)}`;

          break;
        case 'post':
        case 'patch':
          requestInit.body = args[0];
      }
    }

    return requestInit;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, config.json, config.credentials, config.headers, config.method]);

  const onRequest = React.useCallback(async (...args: RequestArgs<S>) => {
    setPending(true);
    setError(null);
    const requestConfig = getConfig(...args);
    const { json } = requestConfig;

    try {
      const response = await request(requestConfig.url, requestConfig);
      const data = await (json ? response.json() : response.text());

      return json ? data : (data.trim() === 'null' ? undefined : data);
    } catch (e) {
      setError(e);

      throw e;
    } finally {
      setPending(false);
      setFetched(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getConfig]);

  return [onRequest, { error, pending, fetched }];
}
