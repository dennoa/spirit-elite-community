import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import firebase from 'firebase/app';

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = { loginFailure: false, loading: false };
        this.handleAuthStateChange = this.handleAuthStateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);
        this.handleError = this.handleError.bind(this);
        this.signUp = this.signUp.bind(this);
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(this.handleAuthStateChange);
    }

    handleAuthStateChange(auth) {
        if (auth) {
            this.setState({ loading: true, loginFailure: false });
            const obj = this;
            const db = firebase.database();
            db.ref(`admins/${auth.uid}`).once('value', adminSnapshot => {
                const isAdmin = adminSnapshot.val();
                db.ref(`users/${auth.uid}`).once('value', userSnapshot => {
                    const user = userSnapshot.val();
                    return obj.handleSuccess(user, isAdmin);
                }, obj.handleError);
            }, obj.handleError);
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const email = e.target.elements.email.value.toLowerCase();
        const password = e.target.elements.password.value;
        this.setState({ loading: true, loginFailure: false });
        if ((email.length < 5) || (password.length === 0)) { return this.handleError(); }
        return firebase.auth().signInWithEmailAndPassword(email, password)
            .catch(this.handleError);
    }

    handleSuccess(user, isAdmin) {
        this.setState({ loading: false, loginFailure: false });
        this.props.route.state.onUser(user);
        this.props.route.state.onIsAdmin(isAdmin);
        return browserHistory.push('/');
    }

    handleError() {
        return this.setState({ loading: false, loginFailure: true });
    }

    signUp(e) {
        e.preventDefault();
        return browserHistory.push('/signup');
    }

    render() {
        return (
            <div className="container">
                <form name="login-form" onSubmit={this.handleSubmit}>
                    <h1>Sign In</h1>
                    <p>No login yet? Please <a href="/signup" onClick={this.signUp}>sign up</a> to get started.</p>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input className="form-control" disabled={this.state.loading} type="email" name="email" placeholder="Email Address" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input className="form-control" disabled={this.state.loading} type="password" name="password" placeholder="Password" />
                    </div>
                    {this.state.loginFailure && <div className="text-danger">Sorry, we don't recognise that email address and password</div>}
                    <div>
                        <button className="btn btn-primary" disabled={this.state.loading} type="submit">
                            Sign In {this.state.loading && <span className="glyphicon glyphicon-refresh spinning" aria-hidden="true" />}
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

Login.propTypes = {
    route: PropTypes.object.isRequired
};

export default Login;
