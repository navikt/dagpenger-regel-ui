import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Verdikoder } from '../Context/Verdikoder';
import Dashboard from './Dashboard';
import { Header } from '../Components/Header';

import './App.css';

const App = () => (
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
);


export default App;
