import './reset.css';
import * as React from 'react';
import { AppPreloader } from './modules/auth';
import { DictionariesProvider } from './modules/dictionaries';
import { Provider } from 'react-redux';
import { ThemedContainer } from './modules/theme';
import dayjs from 'dayjs';
import ReactDOM from 'react-dom';
import relativeTime from 'dayjs/plugin/relativeTime';
import store from './store';

dayjs.extend(relativeTime);

declare global {
  interface Window {
    gapi: any
  }
}

const App = React.lazy(async () => import('./App'));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemedContainer>
        <DictionariesProvider>
          <AppPreloader>
            <React.Suspense fallback={null}>
              <App/>
            </React.Suspense>
          </AppPreloader>
        </DictionariesProvider>
      </ThemedContainer>
    </Provider>
  </React.StrictMode>,
  document.getElementById('app'),
);
