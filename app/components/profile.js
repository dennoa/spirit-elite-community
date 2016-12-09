import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import firebase from 'firebase/app';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = { user: this.props.route.state.user, loading: false, saveFailure: null };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSuccess = this.handleSuccess.bind(this);
        this.handleError = this.handleError.bind(this);
        this.handleNameChange = this.handleNameChange.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({ loading: true, saveFailure: null });
        const handleSuccess = this.handleSuccess;
        const handleError = this.handleError;
        const data = e.target.elements;
        const ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}`);
        ref.update({
            name: data.name.value
        }).then(() => {
            ref.once('value', snapshot => {
                const user = snapshot.val();
                return (user) ? handleSuccess(user) : handleError();
            });
        }).catch(handleError);
    }

    handleSuccess(user) {
        this.setState({ loading: false, saveFailure: null });
        this.props.route.state.onUser(user);
        browserHistory.push('/');
    }

    handleError(failure) {
        this.setState({ loading: false, saveFailure: failure });
    }

    handleNameChange(e) {
        this.setState({ user: { name: e.target.value } });
    }

    cancel() {
        browserHistory.push('/');
    }

    render() {
        return (
            <div className="container">
                <form name="profile-form" onSubmit={this.handleSubmit}>
                    <h1>Profile</h1>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input className="form-control" type="text" name="name" placeholder="Name" value={this.state.user.name} onChange={this.handleNameChange} />
                    </div>
                    {this.state.saveFailure && <div className="text-danger">{this.state.saveFailure}</div>}
                    <div>
                        <button className="btn btn-default" type="button" onClick={this.cancel}>Cancel</button>
                        <button className="btn btn-primary" disabled={this.state.loading} type="submit">
                            Save {this.state.loading && <span className="glyphicon glyphicon-refresh spinning" aria-hidden="true" />}
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

Profile.propTypes = {
    route: PropTypes.object.isRequired
};

export default Profile;
