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
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(this.handleAuthStateChange);
    }

    handleAuthStateChange(auth) {
        if (auth) {
            const handleSuccess = this.handleSuccess;
            const handleError = this.handleError;
            this.setState({ loading: true, loginFailure: false });
            firebase.database().ref(`users/${auth.uid}`).once('value', snapshot => {
                const user = snapshot.val();
                return (user) ? handleSuccess(user) : handleError();
            });
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ loading: true, loginFailure: false });
        const email = e.target.elements.email.value;
        const password = e.target.elements.password.value;
        if ((email.length < 5) || (password.length === 0)) { return this.handleError(); }
        return firebase.auth().signInWithEmailAndPassword(email, password).catch(this.handleError);
    }

    handleSuccess(user) {
        this.setState({ loading: false, loginFailure: false });
        this.props.route.state.onUser(user);
        return browserHistory.push('/');
    }

    handleError() {
        return this.setState({ loading: false, loginFailure: true });
    }

    render() {
        return (
            <div className="container">
                <form name="login-form" onSubmit={this.handleSubmit}>
                    <h1>Sign In</h1>
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
