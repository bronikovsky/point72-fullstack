import * as React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import usePermission from '../../hooks/usePermission';

type Props = RouteProps & {
  admin?: boolean;
  component: React.ElementType;
}

const ProtectedRoute = (props: Props): React.ReactElement | null => {
  const { admin, component: Component, ...routeProps } = props;
  const canAccess = usePermission(admin);

  return canAccess === undefined ? null : (
    <Route
      {...routeProps}
      render={componentProps => (
        canAccess ? <Component {...componentProps}/> : <Redirect to={'/'}/>
      )}
    />
  );
};

export default ProtectedRoute;
