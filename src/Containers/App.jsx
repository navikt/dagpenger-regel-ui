import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Dashboard from './Dashboard';

import styles from './App.css';

const App = () => (
  <div className={styles.app}>
    <header>
      dsfdsfd
    </header>
    <Router>
      <Route exact path="/aktorId/:aktorId/beregningdato/:beregningdato/vilkarId/:vilkarid" component={Dashboard} />
    </Router>
  </div>
);

export default App;
