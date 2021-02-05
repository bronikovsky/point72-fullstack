import * as React from 'react';
import { Account } from './modules/account';
import { ConnectedRouter } from 'connected-react-router';
import { history } from './store';
import { Layout } from './modules/ui';
import { PageLoading, R } from './modules/common';
import { ProtectedRoute } from './modules/auth';
import { Redirect, Switch } from 'react-router-dom';

const App = (): React.ReactElement => {
  return (
    <ConnectedRouter history={history}>
      <PageLoading/>
      <Layout>
        <Switch>
          <Redirect from={R.ROOT} to={R.ACCOUNT} exact/>

          <ProtectedRoute path={R.ACCOUNT} component={Account}/>

          <Redirect to={R.ACCOUNT}/>
        </Switch>
      </Layout>
    </ConnectedRouter>
  );
};

export default App;

