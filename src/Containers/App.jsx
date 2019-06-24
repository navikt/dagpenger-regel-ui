import React, { useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Verdikoder } from '../Context/Verdikoder';
import Dashboard from './Dashboard';
import { Header } from '../Components/Header';
import ErrorBoundary from '../Components/ErrorBoundary';

import './App.css';


const App = () => {
  const [errors, setError] = useState({ hasError: false, status: null, statusText: null });

  // apply interceptor on response
  axios.interceptors.response.use(
    response => response,
    error => setError({ hasError: true, ...error }),
  );
  return (
    <Verdikoder>
      <div className="app">
        <Header />
        <ErrorBoundary apiErrors={errors}>
          <div role="main" className="main">
            <Router>
              <Route exact path="/inntekter/readonly" render={props => <Dashboard readOnly {...props} />} />
              <Route exact path="/inntekter" render={props => <Dashboard {...props} />} />
            </Router>
          </div>
        </ErrorBoundary>
      </div>
    </Verdikoder>
  );
};


export default App;
