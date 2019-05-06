import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Systemtittel } from 'nav-frontend-typografi';
import { ReactComponent as NavLogo } from '../images/nav.svg';
import Dashboard from './Dashboard';

import './App.css';

const App = () => (
  <div className="app">
    <header className="dekorator">
      <NavLogo className="logo" />
      <Systemtittel>Dagpenger</Systemtittel>
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
