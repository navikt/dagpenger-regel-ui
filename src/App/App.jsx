import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { init } from '@sentry/browser';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';
import introspectionQueryResultData from '../fragmentTypes.json';
import { Verdikoder } from '../Context/Verdikoder';
import Dashboard from './Dashboard';
import { Header } from '../Components/Header';
import ErrorBoundary from '../Components/ErrorBoundary';

import './App.css';

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

const cache = new InMemoryCache({ fragmentMatcher });

const link = new HttpLink({
  uri: '/graphql',
  credentials: 'same-origin',
});

const client = new ApolloClient({
  link,
  cache,
});

const environment = window.location.hostname;

init({
  dsn: 'https://27d38c9082cc45248d48e24e2cc7f2fb@sentry.nais.adeo.no/10',
  environment,
});

const App = () => {
  return (
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <Verdikoder>
          <div className="app">
            <Header />

            <div role="main" className="main">
              <Router>
                <Route exact path="/inntekter/readonly" render={props => <Dashboard readOnly {...props} />} />
                <Route exact path="/inntekter" render={props => <Dashboard {...props} />} />
              </Router>
            </div>
          </div>
        </Verdikoder>
      </ApolloProvider>
    </ErrorBoundary>
  );
};

export default App;
