import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";


class AddressBook extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gasPrice: 0,
		};

	}

	render() {
		return (

			<div>
				<div className="col-3">

				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
});

AddressBook = connect(mapStateToProps)(AddressBook);
export default AddressBook;
