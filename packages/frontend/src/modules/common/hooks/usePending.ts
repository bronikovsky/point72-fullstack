import * as React from 'react';
import { GlobalState } from '../../../store';
import { useDispatch, useSelector } from 'react-redux';
import slice from '../slice';

const nameGenerator = (function * nameGenerator(): Generator<string> {
  let id = 0;

  while (true) {
    yield `anonymous-pending-action-${id++}`;
  }
})();

function getAnonymousActionName(): string {
  return nameGenerator.next().value;
}

type UsePending = [
  boolean,
  (value: boolean) => void,
]

export default function usePending(): UsePending {
  const name = React.useMemo<string>(() => {
    return getAnonymousActionName();
  }, []);

  const dispatch = useDispatch();
  const pending = useSelector<GlobalState, boolean>(state => state.common.pendingActions.includes(name));

  const setPending = React.useCallback((value: boolean) => {
    if (value) {
      dispatch(slice.actions.addPendingAction(name));
    } else {
      dispatch(slice.actions.removePendingAction(name));
    }
  }, [dispatch, name]);

  React.useEffect(() => {
    return () => {
      dispatch(slice.actions.removePendingAction(name));
    };
  }, [dispatch, name]);

  return [pending, setPending];
}
