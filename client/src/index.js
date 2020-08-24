import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import { getToken } from './utils/index'
//css => gestalt
import 'gestalt/dist/gestalt.css';

//components
import Navbar from './components/Navbar'
import App from './components/App';
import Signin from './components/Signin';
import Signup from './components/Signup';
import Checkout from './components/Checkout';
import Brews from './components/Brews';

import registerServiceWorker from "./registerServiceWorker";

//Private Routing
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    getToken() !== null ?
      <Component {...props} /> : <Redirect to={{
        pathname: '/signin',
        state: { from: props.location }
      }} />
  )} />
)

const Root = () => (
    <Router>
        <React.Fragment>
            <Navbar />
                <Switch>
                    <Route component={App} exact path="/" />
                    <Route component={Signin} path="/signin" />
                    <Route component={Signup} path="/signup" />
                    <PrivateRoute component={Checkout} path="/checkout" />
                    <Route component={Brews} path="/:brandId" />
                </Switch>
        </React.Fragment>
    </Router>
)
ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();