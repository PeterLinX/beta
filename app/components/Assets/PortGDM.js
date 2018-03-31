import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";
import NEPQRModal from "./NEPQRModal.js";
import gdmLogo from "../../img/gdm.png";

class PortGDM extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gdmPrice: 0
		};

	}

	render() {
		return (

			<div>



						<div className="col-3 ">

						<div className="port-logo-col">
						<img
							src={gdmLogo}
							alt=""
							width="62"
							className="port-logos"
						/>
						<hr className="dash-hr" />
						<h3><NEPQRModal />   <Link to="/sendGDM"><span className=" glyphicon glyphicon-send "/></Link></h3>
						</div>
						<Link to="/sendGDM">
						<div className="port-price-col">
							<span className="market-price">Guardium {numeral(this.props.marketGDMPrice).format("$0,0.00")}</span>
							<h3>{numeral(this.props.gdm/10000000000).format("0,0.0000")}  <span className="ltc-price"> GDM</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">{numeral((this.props.gdm/10000000000) * this.props.marketGDMPrice).format("$0,0.00")} USD</span>
						</div></Link>
						</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	gdm: state.wallet.Gdm,
	marketGDMPrice: state.wallet.marketGDMPrice
});

PortGDM = connect(mapStateToProps)(PortGDM);
export default PortGDM;
