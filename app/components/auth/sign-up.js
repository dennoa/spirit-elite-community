import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import firebase from 'firebase/app';

class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            signUpFailure: false,
            loading: false,
            userInvitations: [],
            name: null,
            email: null,
            password: null
        };
        this.handleAuthStateChange = this.handleAuthStateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);
        this.handleError = this.handleError.bind(this);
        this.findInvite = this.findInvite.bind(this);
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged(this.handleAuthStateChange);
        const obj = this;
        firebase.database().ref('user-invitations').once('value', snapshot => {
            obj.setState({ userInvitations: snapshot.val() || [] });
        });
    }

    handleAuthStateChange(auth) {
        if (auth) {
            this.setState({ loading: true, signUpFailure: false });
            const obj = this;
            const db = firebase.database();
            db.ref(`admins/${auth.uid}`).once('value', adminSnapshot => {
                const isAdmin = adminSnapshot.val();
                db.ref(`users/${auth.uid}`).once('value', userSnapshot => {
                    const user = userSnapshot.val();
                    return obj.handleSuccess(user, isAdmin);
                }, () => {
                    const user = obj.findInvite(auth.email);
                    if (!user) { return obj.handleError(); }
                    return db.ref(`users/${auth.uid}`).set(user)
                        .then(() => obj.handleSuccess(user, isAdmin))
                        .catch(obj.handleError);
                });
            }, obj.handleError);
        }
    }

    handleSubmit(e) {
        e.preventDefault();
        const name = e.target.elements.name.value;
        const email = e.target.elements.email.value.toLowerCase();
        const password = e.target.elements.password.value;
        this.setState({ loading: true, signUpFailure: false, name, email, password });
        if (!this.findInvite(email)) {
            return this.handleError();
        }
        return firebase.auth()
            .createUserWithEmailAndPassword(email, password)
            .catch(this.handleError);
    }

    handleSuccess(user, isAdmin) {
        this.setState({ loading: false, signUpFailure: false });
        this.props.route.state.onUser(user);
        this.props.route.state.onIsAdmin(isAdmin);
        return browserHistory.push('/');
    }

    handleError() {
        return this.setState({ loading: false, signUpFailure: true });
    }

    findInvite(email) {
        const invites = this.state.userInvitations.filter(invite => invite.email === email);
        return (invites.length > 0) ? invites[0] : null;
    }

    render() {
        return (
            <div className="container">
                <form name="signup-form" onSubmit={this.handleSubmit}>
                    <h1>Sign Up</h1>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input className="form-control" disabled={this.state.loading} type="text" name="name" placeholder="Name" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input className="form-control" disabled={this.state.loading} type="email" name="email" placeholder="Email Address" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input className="form-control" disabled={this.state.loading} type="password" name="password" placeholder="Password" />
                    </div>
                    {this.state.signUpFailure && <div className="text-danger">Sorry, we were unable to sign you up</div>}
                    <div>
                        <button className="btn btn-primary" disabled={this.state.loading} type="submit">
                            Sign Up {this.state.loading && <span className="glyphicon glyphicon-refresh spinning" aria-hidden="true" />}
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

SignUp.propTypes = {
    route: PropTypes.object.isRequired
};

export default SignUp;
