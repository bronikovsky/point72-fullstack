import { Middleware } from 'redux';
import { replace } from 'ramda';
import state, { CommonState } from '../slice';

const trackedActions: string[] = [
  'auth/fetchUser',
  'FETCH_RESULTS',
];

export default function pendingActionsMiddleware<T extends { common: CommonState }>(): Middleware<any, T> {
  return store => next => action => {
    const { pendingActions } = store.getState().common;
    const { type } = action;
    const isStartingThunk = type.endsWith('pending') || type.endsWith('_STARTED');
    const isEndingThunk = !isStartingThunk
      && (type.endsWith('fulfilled') || type.endsWith('rejected') || type.endsWith('_SUCCESS') || type.endsWith('_FAILURE'));
    const baseAction = replace(/\/(pending|fulfilled|rejected|_FAILURE|_SUCCESS|_STARTED)/, '', type);

    if (isStartingThunk && trackedActions.includes(baseAction)) {
      store.dispatch(state.actions.addPendingAction(baseAction));
    }

    if (isEndingThunk && pendingActions.includes(baseAction)) {
      store.dispatch(state.actions.removePendingAction(baseAction));
    }

    return next(action);
  };
}
