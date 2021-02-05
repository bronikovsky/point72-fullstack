import useCurrentUser from './useCurrentUser';
import useIsAuthenticated from './useIsAuthenticated';

export default function usePermission(admin?: boolean): boolean | undefined {
  const user = useCurrentUser();
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) {
    return isAuthenticated;
  }

  return admin ? user!.is_admin : true;
}
