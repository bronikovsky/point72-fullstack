import * as React from 'react';
import { fetchUser } from '../../slice/thunks';
import { GlobalState } from '../../../../store';
import { useDispatch, useSelector } from 'react-redux';
import Auth from '../Auth';
import useIsAuthenticated from '../../hooks/useIsAuthenticated';

type Props = {
  children: React.ReactElement | React.ReactPortal;
  fallback?: React.ReactElement;
}

const AppPreloader = (props: Props): React.ReactElement | null => {
  const { children } = props;
  const dispatch = useDispatch();
  const fetched = useSelector<GlobalState, boolean>(state => state.auth.fetched);
  const isAuthenticated = useIsAuthenticated();

  React.useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  if (!fetched) {
    return null;
  }

  return !isAuthenticated ? <Auth/> : children;
};

export default AppPreloader;
