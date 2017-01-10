import React from 'react';
import { Router, Route, IndexRoute, browserHistory } from 'react-router';
import firebase from 'firebase/app';
import { Login, SignUp } from '../components/auth';
import Home from '../components/home';
import Invite from '../components/invite';
import Main from '../components/main';
import Profile from '../components/profile';
import Teams from '../components/teams';
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
            <Route path="invite" component={Invite} state={state} onEnter={secureRoute} />
            <Route path="profile" component={Profile} state={state} onEnter={secureRoute} />
            <Route path="teams" component={Teams} state={state} onEnter={secureRoute} />
            <Route path="login" component={Login} state={state} />
            <Route path="signup" component={SignUp} state={state} />
        </Route>
    </Router>
);

module.exports = routes;
