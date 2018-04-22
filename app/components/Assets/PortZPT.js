import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";
import NEPQRModal from "./NEPQRModal.js";
import zptLogo from "../../img/zpt.png";

class PortZPT extends Component {
	constructor(props) {
		super(props);
		this.state = {
			zptPrice: 0
		};

	}


	render() {
		return (

			<div>


							<div className="col-3 flipInX">

							<div className="port-logo-col">
							<Link to="/sendZPT"><img
								src={zptLogo}
								alt=""
								width="38"
								className="port-logos"
							/></Link>
							<hr className="dash-hr" />
							<h3><NEPQRModal />   <Link to="/sendZPT"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>
							<Link to="/sendZPT">
							<div className="port-price-col">
								<span className="market-price">Zeepin {numeral(this.props.marketZPTPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.zpt * 100000) / 100000
								).format("0,0.0000")} <span className="neo-price"> ZPT</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">{numeral(this.props.zpt*this.props.marketZPTPrice).format("$0,0.00")} USD</span>
							</div></Link>
							</div>



			</div>
		);
	}
}

const mapStateToProps = state => ({
	zpt: state.wallet.Zpt,
	marketZPTPrice: state.wallet.marketZPTPrice
});

PortZPT = connect(mapStateToProps)(PortZPT);
export default PortZPT;
