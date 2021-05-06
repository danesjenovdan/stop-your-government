import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Header } from "./Header.jsx";
import { NotFound } from "./pages/NotFound.jsx";
import { Home } from "./pages/Home/index.jsx";
import { Chat } from "./pages/Chat/index.jsx";

export const App = () => (
  <div className="app">
    <Router>
      <Header />
      <Switch>
        <Route path="/chat">
          <Chat />
        </Route>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="*">
          <NotFound />
        </Route>
      </Switch>
    </Router>
  </div>
);
