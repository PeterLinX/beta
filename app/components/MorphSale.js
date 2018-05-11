import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../modules/wallet";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";

class MorphSale extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gasPrice: 0,
		};

	}

	render() {
		return (

			<div>
				<div className="featuredDapp-Bar">
				Morpheus Token Sale Pages
				<div className="dappBalance">
					<span className="marg-right-20"> {numeral(this.props.neo).format("0,0")} NEO</span> {numeral(this.props.gas).format("0,0.0000")} GAS
				</div>
					</div>
						<div className="morphbk">
							<div className="row">
								<div className="col-xs-10 col-xs-offset-1 top-100">
								<div className="col-xs-6">
								<h1>Your token sale<br />made easy.</h1>
								<h3>Safe, simple and secure</h3>
								<h4>Your own branded token sale page in Morpheus Wallet. Configure Start and exipry dates, terms and conditions, exchange rates and other important information.</h4>
								<h3 className="top-50">Interested?</h3>
								</div>
								<div className="col-xs-12">
								<div className="col-xs-3" >
								<button className="grey-button top-10">Get in touch</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	gas: state.wallet.Gas,
	neo: state.wallet.Neo,
});

MorphSale = connect(mapStateToProps)(MorphSale);
export default MorphSale;
