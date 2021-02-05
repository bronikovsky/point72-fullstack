import * as React from 'react';
import { PageLoading } from '../../../common';
import classes from './Layout.module.scss';
import Header from '../Header';

type Props = {
  children?: React.ReactNode;
}

const Layout = (props: Props): React.ReactElement => {
  const { children } = props;

  return (
    <div className={classes.root}>
      <PageLoading/>
      <Header/>
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;
