import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";
import NEPQRModal from "./NEPQRModal.js";
import swhLogo from "../../img/swh.png";

class PortSWH extends Component {
	constructor(props) {
		super(props);
		this.state = {
			swhPrice: 0
		};

	}


	render() {
		return (

			<div>


							<div className="col-3 flipInX">

							<div className="port-logo-col">
							<Link to="/sendSWH"><img
								src={swhLogo}
								alt=""
								width="44"
								className="port-logos"
							/></Link>
							<hr className="dash-hr" />
							<h3><NEPQRModal />   <Link to="/sendSWH"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>
							<Link to="/sendSWH">
							<div className="port-price-col">
								<span className="market-price">Switcheo {numeral(this.props.marketSWHPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.swh * 100000) / 100000
								).format("0,0.0000")} <span className="neo-price"> SWH</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">{numeral(this.props.swh * this.props.marketSWHPrice).format("$0,0.00")} USD</span>
							</div></Link>
							</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	swh: state.wallet.Swh,
	marketSWHPrice: state.wallet.marketSWHPrice
});

PortSWH = connect(mapStateToProps)(PortSWH);
export default PortSWH;
