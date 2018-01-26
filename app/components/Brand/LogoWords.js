import React, { Component } from "react";
import PropTypes from "prop-types";
import img from "../../img/morph-logo@3x.png";

export default class LogoWords extends Component {
    render() {
        return (
            <div>
                <img src={img} alt="logo" width={this.props.width} />
            </div>
        );
    }
}

LogoWords.propTypes = {
    width: PropTypes.number.isRequired
};
