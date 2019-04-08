import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Dashboard from './Dashboard';

import './App.css';

class App extends Component {
  // beregningdato
  // vilkarId
  // aktorId
  // http://localhost:3000/aktorId/1/beregningdato/2019-08-04/vilkarId/2
  render() {
    return (
      <div className="app">
        <header>
          dsfdsfd
        </header>
        <Router>
          <Route exact path="/aktorId/:aktorId/beregningdato/:beregningdato/vilkarId/:vilkarid" component={Dashboard} />
        </Router>
      </div>
    );
  }
}

export default App;
