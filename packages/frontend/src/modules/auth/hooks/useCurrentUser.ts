import { GlobalState } from '../../../store';
import { User } from '../types';
import { useSelector } from 'react-redux';

export default function useCurrentUser(): User | null {
  return useSelector<GlobalState, User | null>(state => state.auth.user);
}
