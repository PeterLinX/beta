import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import galaLogo from "../../img/gala.png";

class PortGALA extends Component {
	constructor(props) {
		super(props);
		this.state = {
			galaPrice: 0
		};

	}


	render() {
		return (

			<div>

							<Link to="/sendGALA">
								<div className="col-3 ">

								<div className="port-logo-col">
								<img
									src={galaLogo}
									alt=""
									width="42"
									className="port-logos"
								/>
								<hr className="dash-hr" />
								<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/sendGALA"><span className=" glyphicon glyphicon-send "/></Link></h3>
								</div>

								<div className="port-price-col">
									<span className="market-price">Galaxy {numeral(this.props.marketGALAPrice).format("$0,0.00")}</span>
									<h3>{numeral(
			              Math.floor(this.props.gala * 100000) / 100000
			            ).format("0,0.0000")}  <span className="dbc-price"> GALA</span></h3>
									<hr className="dash-hr" />
									<span className="market-price">{numeral((this.props.gala/10000000000) * this.props.marketGALAPrice).format("$0,0.00")} USD</span>
								</div>
								</div>
								</Link>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	gala: state.wallet.Gala,
	marketGALAPrice: state.wallet.marketGALAPrice
});

PortGALA = connect(mapStateToProps)(PortGALA);
export default PortGALA;
