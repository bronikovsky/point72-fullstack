import { RequestStatus, useRequest } from '../../apiv2';

type UseFetchCountries = [
  () => Promise<string[]>,
  RequestStatus,
];

export default function useFetchCountries(): UseFetchCountries {
  return useRequest<string[]>('/dictionary/countries', {
    credentials: 'include',
    method: 'GET',
  });
}
