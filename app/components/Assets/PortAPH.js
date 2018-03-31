import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";
import NEPQRModal from "./NEPQRModal.js";
import aphLogo from "../../img/aph.png";

class PropAPH extends Component {
	constructor(props) {
		super(props);
		this.state = {
			aphPrice: 0,
		};

	}


	render() {
		return (

			<div>


				<div className="col-3 ">
				<div className="port-logo-col">
				<img
					src={aphLogo}
					alt="Aphelion"
					width="44"
					className="port-logos"
				/>
				<hr className="dash-hr" />
				<h3><NEPQRModal />   <Link to="/sendAPH"><span className="glyphicon glyphicon-send"/></Link></h3>
				</div>
				<Link to="/sendAPH">
				<div className="port-price-col">
					<span className="market-price">Aphelion $0.00</span>
					<h3>{numeral(
						Math.floor(this.props.aph * 100000) / 100000
					).format("0,0.0000")} <span className="qlink-price"> APH</span></h3>
					<hr className="dash-hr" />
					<span className="market-price">$0.00 USD</span>
				</div></Link>
				</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	aph: state.wallet.Aph,
	marketAPHPrice: state.wallet.marketAPHPrice,
});

PropAPH = connect(mapStateToProps)(PropAPH);
export default PropAPH;
