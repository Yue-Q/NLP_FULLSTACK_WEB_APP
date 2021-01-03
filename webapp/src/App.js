import React from 'react';
import Auth from './modules/Auth';
import Layout from './components/layout/layout';
import Login from './components/login';
import Signup from './components/signup.js';
import NLPInterface from './components/NLPInterface';
import Home from './components/home';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';



export default function App() {
    return (
      <Router>
      <Layout>
          <Switch>
            <Route exact path="/login" render={(props) => <Login {...props} />} />
            <Route exact path="/signup" render={(props) => <Signup {...props} />} />
            <PrivateRoute exact path="/predict" component={NLPInterface} />
            {/* <Route path="/" render={(props) => <Home {...props} />} /> */}
            <Route path="/" render={(props) => <Home {...props} />} />
          </Switch>
    </Layout>
    </Router>  
    );
}

function PrivateRoute({ component: Component,  ...rest}) {
  return (
    <Route {...rest} render={(props) => {
      return (
        Auth.isUserAuthenticated() ?
          (<Component {...props} />) :
          (<Redirect to={{
            pathname: '/login',
            state: { from: props.location }
          }}
            push
          />)
      )
    }} />
  );
}

