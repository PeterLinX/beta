import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";
import NEPQRModal from "./NEPQRModal.js";
import avaLogo from "../../img/ava.png";

class PortAVA extends Component {
	constructor(props) {
		super(props);
		this.state = {
			avaPrice: 0
		};

	}


	render() {
		return (

			<div>


							<div className="col-3 flipInX">
							<div className="port-logo-col">
							<Link to="/sendCGE"><img
								src={avaLogo}
								alt=""
								width="36"
								className="port-logos"
							/></Link>

							<h3><NEPQRModal />   <Link to="/sendCGE"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div><Link to="/sendCGE">
							<div className="port-price-col">
								<span className="market-price">Travala {numeral(this.props.marketAVAPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.ava * 100000) / 100000
								).format("0,0[.][0000]")} <span id="no-inverse" className="thor-price"> AVA</span></h3>

								<span className="market-price">{numeral(this.props.ava*this.props.marketAVAPrice).format("$0,0.00")} USD</span>
							</div></Link>
							</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	ava: state.wallet.Ava,
	marketAVAPrice: state.wallet.marketAVAPrice
});

PortAVA = connect(mapStateToProps)(PortAVA);
export default PortAVA;
