import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import hashpuppiesLogo from "../../img/hashpuppies.png";
import NEPQRModal from "./NEPQRModal.js";

class PortHP extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};

	}


	render() {
		return (

			<div>



							<div className="col-3">
							<div className="port-logo-col">
							<img
								src={hashpuppiesLogo}
								alt=""
								width="44"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><NEPQRModal />   <Link to="/sendHP"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div><Link to="/sendHP">
							<div className="port-price-col">
								<span className="market-price">Hash Puppies</span>
								<h3>{numeral(
									Math.floor(this.props.rht * 10) / 10
								).format("0,0")} <span className="neo-price"> RHT</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">Priceless</span>
							</div></Link>
							</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	rht: state.wallet.Rht,
});

PortHP = connect(mapStateToProps)(PortHP);
export default PortHP;
