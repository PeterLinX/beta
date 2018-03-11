import React, { Component } from "react";
import PropTypes from "prop-types";
import img from "../../img/neo.png";

export default class Neo extends Component {
	render() {
		return (
			<div>
				<img src={img} alt="logo" width={this.props.width} />
			</div>
		);
	}
}

Neo.propTypes = {
	width: PropTypes.number.isRequired
};
