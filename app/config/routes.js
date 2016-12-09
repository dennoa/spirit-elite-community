import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import firebase from 'firebase/app';
import Main from '../components/main';
import Home from '../components/home';
import Login from '../components/auth/login';
import Profile from '../components/profile';
import state from '../state';

function secureRoute(nextState, replace, callback) {
    if (!firebase.auth().currentUser) {
        replace('/login');
    }
    return callback();
}

const routes = (
    <Router history={browserHistory}>
        <Route path="/" component={Main} state={state}>
            <IndexRoute component={Home} state={state} onEnter={secureRoute} />
            <Route path="login" component={Login} state={state} />
            <Route path="profile" component={Profile} state={state} onEnter={secureRoute} />
        </Route>
    </Router>
);

module.exports = routes;
