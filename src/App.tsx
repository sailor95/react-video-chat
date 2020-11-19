import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Landing from './components/landing';
import Room from './components/room';

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Route path="/room" component={Room} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
