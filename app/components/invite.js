import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import firebase from 'firebase/app';
import UserInvitations from './user-invitations';

class Invite extends Component {
    constructor(props) {
        super(props);
        this.state = { invitations: [], loading: false, saveFailure: null };
        this.isUser = this.isUser.bind(this);
        this.onInviteUser = this.onInviteUser.bind(this);
        this.onRemoveInvitation = this.onRemoveInvitation.bind(this);
        this.save = this.save.bind(this);
        this.onSuccess = this.onSuccess.bind(this);
        this.onError = this.onError.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    componentDidMount() {
        const obj = this;
        firebase.database().ref('user-invitations').once('value', snapshot => {
            const invitations = snapshot.val() || [];
            firebase.database().ref('users').once('value', usersSnapshot => {
                const users = usersSnapshot.val() || [];
                const updated = invitations.filter(invite => !obj.isUser(invite.email, users));
                obj.setState({ invitations: updated });
                if (updated.length !== invitations.length) {
                    obj.save(updated);
                }
            });
        });
    }

    onInviteUser(e) {
        e.preventDefault();
        const user = { email: e.target.elements.email.value, name: e.target.elements.name.value };
        const updated = this.state.invitations.concat(user);
        this.setState({ loading: true, saveFailure: null, invitations: updated });
        this.save(updated);
    }

    onRemoveInvitation(invite) {
        const updated = this.state.invitations.filter(existing => existing.email !== invite.email);
        this.setState({ invitations: updated });
        this.save(updated);
    }

    onSuccess() {
        this.setState({ loading: false, saveFailure: null });
    }

    onError(failure) {
        this.setState({ loading: false, saveFailure: failure });
    }

    isUser(email, users) {
        for (const key of Object.keys(users)) {
            if (users[key].email === email) return true;
        }
        return false;
    }

    save(invitations) {
        firebase.database().ref('user-invitations').set(invitations)
            .then(this.onSuccess)
            .catch(this.onError);
    }

    cancel() {
        browserHistory.push('/');
    }

    render() {
        return (
            <div className="container">
                <form name="invite-add-user-form" onSubmit={this.onInviteUser}>
                    <h1>Invite someone to join</h1>
                    <div className="form-group">
                        <label htmlFor="invite-user-email">Email</label>
                        <input className="form-control" type="email" id="invite-user-email" name="email" placeholder="Email" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="invite-user-name">Name</label>
                        <input className="form-control" type="text" id="invite-user-name" name="name" placeholder="Name" />
                    </div>
                    {this.state.saveFailure && <div className="text-danger">{this.state.saveFailure}</div>}
                    <div>
                        <button className="btn btn-default" type="button" onClick={this.cancel}>Cancel</button>
                        <button className="btn btn-primary" disabled={this.state.loading} type="submit">
                            Save {this.state.loading && <span className="glyphicon glyphicon-refresh spinning" aria-hidden="true" />}
                        </button>
                    </div>
                </form>
                <UserInvitations invitations={this.state.invitations} onRemove={this.onRemoveInvitation} />
            </div>
        );
    }
}

Invite.propTypes = {
    route: PropTypes.object.isRequired
};

export default Invite;
