import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";
import NEPQRModal from "./NEPQRModal.js";
import nrveLogo from "../../img/nrve.png";

class PortNRVE extends Component {
	constructor(props) {
		super(props);
		this.state = {
			nrvePrice: 0
		};

	}


	render() {
		return (

			<div>


						<div className="col-3 flipInX">
						<div className="port-logo-col">
						<Link to="/sendNRVE"><img
							src={nrveLogo}
							alt=""
							width="36"
							className="port-logos"
						/></Link>

						<h3><NEPQRModal />   <Link to="/sendNRVE"><span className=" glyphicon glyphicon-send "/></Link></h3>
						</div><Link to="/sendNRVE">
						<div className="port-price-col">
							<span className="market-price">Narrative $0.00</span>
							<h3>{numeral(
	              Math.floor(this.props.nrve * 100000) / 100000
	            ).format("0,0[.][0000]")}<span id="no-inverse" className="dbc-price"> NRVE</span></h3>

							<span className="market-price">$0.00 USD</span>
						</div></Link>
						</div>



			</div>
		);
	}
}

const mapStateToProps = state => ({
	nrve: state.wallet.Nrve,
	marketNRVEPrice: state.wallet.marketNRVEPrice
});

PortNRVE = connect(mapStateToProps)(PortNRVE);
export default PortNRVE;
