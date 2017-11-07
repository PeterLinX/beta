import React, { Component } from "react";
import PropTypes from "prop-types";
import img from "../../img/btc-logo@2x.png";

export default class Btc extends Component {
  render() {
    return (
      <div>
        <img src={img} alt="logo" width={this.props.width} />
      </div>
    );
  }
}

Btc.propTypes = {
  width: PropTypes.number.isRequired
};
