import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Landing from './components/landing';

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Landing} />
        {/* Add Route for Room */}
      </Switch>
    </BrowserRouter>
  );
};

export default App;
