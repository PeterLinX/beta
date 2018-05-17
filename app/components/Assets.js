import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../modules/wallet";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";

class Assets extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gasPrice: 0,
		};
	}

	render() {
		return (

			<div>

				<div className="row top-10 dash-portfolio center">


				<Link to="/sendLRN">
					<div className="col-5">
						<span className="market-price">Loopring {numeral(this.props.marketLRNPrice).format("$0,0.00")}</span>
						<h3>{numeral(
							Math.floor(this.props.lrn * 100000) / 100000
						).format("0,0[.][0000]")} <span className="ltc-price"> LRN</span></h3>
						<hr className="dash-hr" />
						<span className="market-price">{numeral(this.props.lrn*this.props.marketLRNPrice).format("$0,0.00")} USD</span>
					</div>
				</Link>

				<Link to="/sendGDM">
					<div className="col-5">
						<span className="market-price">Guardium {numeral(this.props.marketGDMPrice).format("$0,0.00")}</span>
						<h3>{numeral(
							Math.floor(this.props.gdm * 100000) / 100000
						).format("0,0[.][0000]")} <span className="eth-price"> GDM</span></h3>
						<hr className="dash-hr" />
						<span className="market-price">{numeral(this.props.gdm * this.props.marketGDMPrice).format("$0,0.00")}  USD</span>
					</div>
				</Link>


					<Link to="/sendCGE">
						<div className="col-5">
							<span className="market-price">Travala {numeral(this.props.marketAVAPrice).format("$0,0.00")}</span>
							<h3>{numeral(
								Math.floor(this.props.ava * 100000) / 100000
							).format("0,0[.][0000]")} <span id="no-inverse" className="thor-price"> AVA</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">{numeral(this.props.ava*this.props.marketAVAPrice).format("$0,0.00")} USD</span>
						</div>
					</Link>


					<Link to="/sendSWH">
						<div className="col-5">
							<span className="market-price">Switcheo {numeral(this.props.marketSWHTPrice).format("$0,0.00")}</span>
							<h3>{numeral(
								Math.floor(this.props.swht * 100000) / 100000
							).format("0,0[.][0000]")} <span id="no-inverse" className="neo-price"> SWHT</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">{numeral(this.props.swht*this.props.marketSWHTPrice).format("$0,0.00")} USD</span>
						</div>
					</Link>


					<Link to="/sendONT">
						<div className="col-5">
							<span className="market-price">Ontology {numeral(this.props.marketONTPrice).format("$0,0.00")}</span>
							<h3>{numeral(
								Math.floor(this.props.ont * 100000) / 100000
							).format("0,0[.][0000]")} <span id="no-inverse" className="dbc-price"> ONT</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">{numeral(this.props.ont*this.props.marketONTPrice).format("$0,0.00")} USD</span>
						</div>
					</Link>

				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	gas: state.wallet.Gas,
	neo: state.wallet.Neo,
	ava: state.wallet.Ava,
	lrn: state.wallet.Lrn,
	swht: state.wallet.Swht,
	gdm: state.wallet.Gdm,
	ont: state.wallet.Ont,
	address: state.account.address,
	net: state.metadata.network,
	price: state.wallet.price,
	gasPrice: state.wallet.gasPrice,
	marketGASPrice: state.wallet.marketGASPrice,
	marketNEOPrice: state.wallet.marketNEOPrice,
	marketAVAPrice: state.wallet.marketAVAPrice,
	marketLRNPrice: state.wallet.marketLRNPrice,
	marketONTPrice: state.wallet.marketONTPrice,
	marketGDMPrice: state.wallet.marketGDMPrice,
	marketSWHTPrice: state.wallet.marketSWHTPrice
});

Assets = connect(mapStateToProps)(Assets);

export default Assets;
