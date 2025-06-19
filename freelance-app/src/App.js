import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Notifications from './pages/Notifications';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/notifications" component={Notifications} />
          {/* Add more routes here as needed */}
        </Switch>
      </div>
    </Router>
  );
}

export default App;