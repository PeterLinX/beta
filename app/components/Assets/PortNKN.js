import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import nknLogo from "../../img/nkn.png";
import NEPQRModal from "./NEPQRModal.js";

class PortNKN extends Component {
	constructor(props) {
		super(props);
		this.state = {
			soulPrice: 0
		};

	}


	render() {
		return (

			<div>


							<div className="col-3 flipInX">
							<div className="port-logo-col">
							<Link to="/sendNKN"><img
								src={nknLogo}
								alt=""
								width="44"
								className="port-logos"
							/></Link>

							<h3><NEPQRModal />   <Link to="/sendNKN"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div><Link to="/sendNKN">
							<div className="port-price-col">
								<span className="market-price">New Kind Network {numeral(this.props.marketNKNPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.nkn * 100000) / 100000
								).format("0,0[.][0000]")} <span id="no-inverse" className="thor-price"> NKN</span></h3>

								<span className="market-price">{numeral(this.props.nkn*this.props.marketNKNPrice).format("$0,0.00")} USD</span>
							</div></Link>
							</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	nkn: state.wallet.Nkn,
	marketNKNPrice: state.wallet.marketNKNPrice,
});

PortNKN = connect(mapStateToProps)(PortNKN);
export default PortNKN;
