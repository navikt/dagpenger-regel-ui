import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Dashboard from './Dashboard';

import styles from './App.css';

const App = () => (
  <div className={styles.app}>
    <header>
      Dagpenger
    </header>
    <Router>
      <Route exact path="/inntekter/readonly" render={props => <Dashboard readOnly {...props} />} />
      <Route exact path="/inntekter" render={props => <Dashboard {...props} />} />

      {/* Only for dev */}
      <Route render={props => <Dashboard {...props} />} />
    </Router>
  </div>
);

export default App;
