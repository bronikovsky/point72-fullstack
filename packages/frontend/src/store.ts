import { slice as authSlice } from './modules/auth';
import { combineReducers } from 'redux';
import { slice as commonSlice, pendingActionsMiddleware } from './modules/common';
import { configureStore } from '@reduxjs/toolkit';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';
import { slice as themeSlice } from './modules/theme';

export const history = createBrowserHistory();

const rootReducer = combineReducers({
  auth: authSlice.reducer,
  theme: themeSlice.reducer,
  common: commonSlice.reducer,
  router: connectRouter(history),
});

export type GlobalState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => {
    const customMiddleware = [routerMiddleware(history), pendingActionsMiddleware()];

    return getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(customMiddleware);
  },
});

export default store;
