import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import ethLogo from "../../img/eth.png";

class PortETH extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gasPrice: 0,
		};

	}


	render() {
		return (

			<div>


							<div className="col-3 flipInX">

							<div className="port-logo-col">
							<Link to="/sendETH"><img
								src={ethLogo}
								alt=""
								width="28"
								className="port-logos"
							/></Link>
							<hr className="dash-hr" />
							<h3><Link to="/sendETH"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/sendETH"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>
							<Link to="/NewEthereum">
							<div className="port-price-col">
								<span className="market-price">Ethereum {numeral(this.props.marketETHPrice).format("$0,0.00")}</span>
								<h3>{numeral(this.props.eth/10000000000).format("0,0.0000")}  <span className="eth-price"> ETH</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">{numeral((this.props.eth/10000000000) * this.props.marketETHPrice).format("$0,0.00")} USD</span>
							</div></Link>
							</div>



			</div>
		);
	}
}

const mapStateToProps = state => ({
	eth: state.wallet.Eth,
	marketETHPrice: state.wallet.marketETHPrice,
});

PortETH = connect(mapStateToProps)(PortETH);
export default PortETH;
