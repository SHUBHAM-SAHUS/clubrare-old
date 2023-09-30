import React from 'react';
import ReactDOM from 'react-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'react-toastify/dist/ReactToastify.css';
import 'rc-drawer/assets/index.css';
import './assets/styles/custom-styles.scss';
import './assets/styles/utility-styles.scss';
import './assets/styles/tailwind.css';
import App from './app';
import reportWebVitals from './report-web-vitals';
import './i18n';
import { Provider } from 'react-redux';
import { store } from './redux';
import './interceptor/http-interceptor';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from './components/error-fallback';
import { createBrowserHistory } from 'history';

//Add these lines
const { REACT_APP_SENTRY_DSN, REACT_APP_ENV } = process.env;

if (REACT_APP_SENTRY_DSN && REACT_APP_ENV == 'production') {
  const history = createBrowserHistory();
  Sentry.init({
    dsn: REACT_APP_SENTRY_DSN,
    environment: process.env.REACT_APP_ENV,
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation: Sentry.reactRouterV5Instrumentation(history),
      }),
    ],
    tracesSampleRate: 1.0,
  });
}

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('root'),
);

reportWebVitals();
