import React, { Component } from "react";
import PropTypes from "prop-types";
import img from "../../images/app-logo.png";

class Logo extends Component {
	render() {
		return (
			<div>
				<img src={img} alt="logo" width={this.props.width} />
			</div>
		);
	}
}

Logo.propTypes = {
	width: PropTypes.number.isRequired
};

export default Logo;
