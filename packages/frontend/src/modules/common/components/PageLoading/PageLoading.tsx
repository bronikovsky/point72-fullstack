import * as React from 'react';
import { GlobalState } from '../../../../store';
import { useSelector } from 'react-redux';
import classes from './PageLoading.module.scss';

const PageLoading = (): React.ReactElement | null => {
  const hasPendingActions = useSelector((state: GlobalState) => Boolean(state.common.pendingActions.length));

  return hasPendingActions ? <div className={classes.root}/> : null;
};

export default PageLoading;
