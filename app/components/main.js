import React, { PropTypes } from 'react';
import NormalizeIgnored from 'normalize.css';
import StylesIgnored from '../styles/main.css';
import Header from './header';

const Main = props => (
    <div>
        <Header state={props.route.state} />
        {props.children}
    </div>
);

Main.propTypes = {
    children: PropTypes.object.isRequired,
    route: PropTypes.object.isRequired
};

export default Main;
