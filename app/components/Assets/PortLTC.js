import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import ltcLogo from "../../img/litecoin.png";

class PortLTC extends Component {
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
								src={ltcLogo}
								alt=""
								width="44"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><Link to={"/receiveLitecoin"} ><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to={"/sendLTC"} ><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>
							<Link to="/NewLitecoin">
							<div className="port-price-col">
								<span className="market-price">Litecoin {numeral(this.props.marketLTCPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.ltc * 100000) / 100000
								).format("0,0.0000")} <span className="ltc-price"> LTC</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">{numeral(this.props.ltc * this.props.marketLTCPrice).format("$0,0.00")} USD</span>
							</div></Link>
							</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	ltc: state.wallet.Ltc,
	marketLTCPrice: state.wallet.marketLTCPrice,
});

PortLTC = connect(mapStateToProps)(PortLTC);
export default PortLTC;
