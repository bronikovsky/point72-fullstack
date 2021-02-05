import { GlobalState } from '../../../store';
import { useSelector } from 'react-redux';

export default function useIsAuthenticated(): boolean | undefined {
  return useSelector<GlobalState, boolean | undefined>(({ auth }) => {
    return !auth.fetched ? undefined : Boolean(auth.user);
  });
}
