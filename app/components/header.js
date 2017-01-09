import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import firebase from 'firebase/app';

class Header extends Component {
    constructor(props) {
        super(props);
        this.goHome = this.goHome.bind(this);
        this.invite = this.invite.bind(this);
        this.profile = this.profile.bind(this);
        this.logout = this.logout.bind(this);
    }

    goHome(e) {
        e.preventDefault();
        return browserHistory.push('/');
    }

    invite(e) {
        e.preventDefault();
        return browserHistory.push('/invite');
    }

    profile(e) {
        e.preventDefault();
        return browserHistory.push('/profile');
    }

    logout(e) {
        e.preventDefault();
        return firebase.auth().signOut().then(() => browserHistory.push('/login'));
    }

    render() {
        return (
            <div>
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                                <span className="sr-only">Toggle navigation</span>
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                                <span className="icon-bar" />
                            </button>
                            <a className="navbar-brand" href="/" onClick={this.goHome}>{this.props.state.user && this.props.state.user.name}</a>
                        </div>
                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <ul className="nav navbar-nav navbar-right">
                                {this.props.state.isAdmin && <li><a href="/" onClick={this.invite}>Invite</a></li>}
                                <li><a href="/" onClick={this.profile}>Profile</a></li>
                                <li><a href="/" onClick={this.logout}>Logout</a></li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}

Header.propTypes = {
    state: PropTypes.object.isRequired
};

export default Header;
