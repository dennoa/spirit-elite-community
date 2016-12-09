import React, { Component, PropTypes } from 'react';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = { user: this.props.route.state.user };
    }

    render() {
        return (
            <div className="container">
                <h1>Welcome {this.state.user.name}</h1>
            </div>
        );
    }
}

Home.propTypes = {
    route: PropTypes.object.isRequired
};

export default Home;
