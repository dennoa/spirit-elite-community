import React, { Component, PropTypes } from 'react';

function UserInvitation(props) {
    return (
        <tr>
            <td>{props.invite.name}</td>
            <td>{props.invite.email}</td>
            <td><button className="btn btn-danger" onClick={props.onRemove}><span className="glyphicon glyphicon-remove" aria-hidden="true" /></button></td>
        </tr>
    );
}

UserInvitation.propTypes = {
    invite: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired
};

class UserInvitations extends Component {
    constructor(props) {
        super(props);
        this.onRemove = this.onRemove.bind(this);
    }

    onRemove(invite) {
        return e => {
            e.preventDefault();
            this.props.onRemove(invite);
        };
    }

    render() {
        const rows = this.props.invitations.map(invite => <UserInvitation key={invite.email} invite={invite} onRemove={this.onRemove(invite)} />);
        if (rows.length === 0) {
            return <div />;
        }
        return (
            <div>
                <h1>Pending invitations</h1>
                <table className="table">
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th />
                    </tr>
                    {rows}
                </table>
            </div>
        );
    }
}

UserInvitations.propTypes = {
    invitations: PropTypes.object.isRequired,
    onRemove: PropTypes.func.isRequired
};

export default UserInvitations;
