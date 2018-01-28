import React, { Component } from "react";
import PropTypes from "prop-types";
import img from "../../images/new-logo.png";

class Dashlogo extends Component {
	render() {
		return (
			<div>
				<img src={img} alt="logo" width={this.props.width} />
			</div>
		);
	}
}

Dashlogo.propTypes = {
	width: PropTypes.number.isRequired
};

export default Dashlogo;
