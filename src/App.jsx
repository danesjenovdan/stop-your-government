import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Header } from './components/Header.jsx';
import { Stories } from './pages/Stories.jsx';
import { Story } from './pages/Story.jsx';
import { Home } from './pages/Home.jsx';
import { NotFound } from './pages/NotFound.jsx';

export const App = () => (
  <div className="app">
    <Router>
      <Switch>
        <Route path="/stories">
          <Header />
          <Stories />
        </Route>
        <Route path="/story">
          <Story />
        </Route>
        <Route path="/hr" exact>
          <Home lang="hrv" />
        </Route>
        <Route path="/sr" exact>
          <Home lang="srp" />
        </Route>
        <Route path="/" exact>
          <Home lang="slv" />
        </Route>
        <Route>
          <Header />
          <NotFound />
        </Route>
      </Switch>
    </Router>
  </div>
);
