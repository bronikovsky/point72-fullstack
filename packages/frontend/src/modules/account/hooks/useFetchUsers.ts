import { PagedQuery, RequestStatus, useRequest } from '../../apiv2';
import { User } from '../../auth';

type Query = PagedQuery<User[]>

type UseFetchUsers = [
  (args?: {
    cursor: number,
    search?: string,
    country?: string,
    ageMin?: number,
    ageMax?: number,
  }) => Promise<Query>,
  RequestStatus,
];

export default function useFetchUsers(): UseFetchUsers {
  return useRequest<Query>('/users', {
    credentials: 'include',
    method: 'GET',
  });
}
