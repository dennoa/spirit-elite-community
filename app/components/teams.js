import React, { Component, PropTypes } from 'react';

class Teams extends Component {
    constructor(props) {
        super(props);
        this.state = { todo: 'todo' };
    }

    render() {
        return (
            <div className="container">
                <h1>Teams</h1>
                <div>{this.state.todo}</div>
            </div>
        );
    }
}

Teams.propTypes = {
    route: PropTypes.object.isRequired
};

export default Teams;
