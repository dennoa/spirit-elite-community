import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import firebase from 'firebase/app';
import Dropzone from 'react-dropzone';

class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this.props.route.state.user,
            loading: false,
            saveFailure: null,
            picFile: null,
            picUrl: null,
            picLoading: false
        };
        this.loadProfilePicture = this.loadProfilePicture.bind(this);
        this.onDropPicture = this.onDropPicture.bind(this);
        this.onPictureUrl = this.onPictureUrl.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onSuccess = this.onSuccess.bind(this);
        this.onError = this.onError.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.cancel = this.cancel.bind(this);
    }

    componentDidMount() {
        this.loadProfilePicture();
    }

    onPictureUrl(url) {
        this.setState({ picUrl: url, picLoading: false });
    }

    onDropPicture(files) {
        if (files.length > 0) {
            this.setState({ picFile: files[0] });
            const reader = new FileReader();
            reader.onload = e => {
                this.setState({ picUrl: e.target.result });
            };
            reader.readAsDataURL(files[0]);
        }
    }

    onSubmit(e) {
        e.preventDefault();
        this.setState({ loading: true, saveFailure: null });
        const data = e.target.elements;
        const toBeSaved = { name: data.name.value };
        const updates = [];
        if (this.state.picFile) {
            toBeSaved.picture = `${firebase.auth().currentUser.uid}/profile-picture`;
            updates.push(firebase.storage().ref().child(toBeSaved.picture).put(this.state.picFile));
        }
        const ref = firebase.database().ref(`users/${firebase.auth().currentUser.uid}`);
        updates.unshift(ref.update(toBeSaved).then(() => new Promise((resolve, reject) => {
            ref.once('value', snapshot => {
                const user = snapshot.val();
                return (user) ? resolve(user) : reject();
            });
        })));
        Promise.all(updates).then(this.onSuccess).catch(this.onError);
    }

    onSuccess(results) {
        this.setState({ loading: false, saveFailure: null });
        this.props.route.state.onUser(results[0]);
        browserHistory.push('/');
    }

    onError(failure) {
        this.setState({ loading: false, saveFailure: failure });
    }

    onNameChange(e) {
        this.setState({ user: { name: e.target.value } });
    }

    loadProfilePicture() {
        if (this.state.user.picture) {
            this.setState({ picLoading: true });
            const ref = firebase.storage().ref();
            ref.child(this.state.user.picture).getDownloadURL().then(this.onPictureUrl);
        }
    }

    cancel() {
        browserHistory.push('/');
    }

    render() {
        return (
            <div className="container">
                <form name="profile-form" onSubmit={this.onSubmit}>
                    <h1>Profile</h1>
                    <div className="form-group">
                        <label htmlFor="profile-name">Name</label>
                        <input className="form-control" type="text" id="profile-name" name="name" placeholder="Name" value={this.state.user.name} onChange={this.onNameChange} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="profile-picture">Picture</label>
                        <div>
                            <Dropzone className="btn btn-default" accept="image/*" onDrop={this.onDropPicture}>
                                {this.state.picUrl && !this.state.picLoading && <img src={this.state.picUrl} alt="you" />}
                                {!this.state.picUrl && !this.state.picLoading && <span>Upload</span>}
                                {this.state.picLoading && <span className="glyphicon glyphicon-refresh spinning" aria-hidden="true" />}
                            </Dropzone>
                        </div>
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
