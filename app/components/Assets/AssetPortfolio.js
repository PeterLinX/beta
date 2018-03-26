import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import swhLogo from "../../img/swh.png";
import pckLogo from "../../img/pck.png";
import thorLogo from "../../img/thor.png";
import orbLogo from "../../img/orb.png";
import rpxLogo from "../../img/rpx.png";
import tncLogo from "../../img/tnc.png";
import tkyLogo from "../../img/tky.png";
import zptLogo from "../../img/zpt.png";
import qlcLogo from "../../img/qlc.png";
import thekeyLogo from "../../img/thekey.png";
import ontLogo from "../../img/ont.png";
import nexLogo from "../../img/nex.png";

class AssetPortolio extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gasPrice: 0,
			acatPrice: 0,
			dbcPrice: 0,
			iamPrice: 0,
			nrvePrice: 0,
			ontPrice: 0,
			qlcPrice: 0,
			rpxPrice: 0,
			tkyPrice: 0,
			tncPrice: 0,
			zptPrice: 0
		};

	}


	render() {
		return (

			<div>

			

						<Link to="/sendONT">
							<div className="col-3">

							<div className="port-logo-col">
							<img
								src={ontLogo}
								alt=""
								width="48"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/sendONT"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>

							<div className="port-price-col">
								<span className="market-price">Ontology {numeral(this.props.marketONTPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.ont * 100000) / 100000
								).format("0,0.0000")} <span className="dbc-price"> ONT</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">{numeral(this.props.ont*this.props.marketONTPrice).format("$0,0.00")} USD</span>
							</div>
							</div>
						</Link>

						<Link to="/sendPKC">
							<div className="col-3">

							<div className="port-logo-col">
							<img
								src={pckLogo}
								alt=""
								width="54"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/sendPCK"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>

							<div className="port-price-col">
								<span className="market-price">Pikcio {numeral(this.props.marketPKCPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.pkc * 100000) / 100000
								).format("0,0.0000")} <span className="dbc-price"> PCK</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">{numeral(this.props.pkc*this.props.marketPKCPrice).format("$0,0.00")} USD</span>
							</div>
							</div>
						</Link>


						<Link to="/sendQLC">
							<div className="col-3">

							<div className="port-logo-col">
							<img
								src={qlcLogo}
								alt=""
								width="50"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/sendQLC"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>

							<div className="port-price-col">
								<span className="market-price">QLink {numeral(this.props.marketQLCPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.qlc * 100000) / 100000
								).format("0,0.0000")} <span className="qlink-price"> QLC</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">{numeral(this.props.qlc*this.props.marketQLCPrice).format("$0,0.00")} USD</span>
							</div>
							</div>
						</Link>


						<Link to="/sendRPX">
							<div className="col-3">

							<div className="port-logo-col">
							<img
								src={rpxLogo}
								alt=""
								width="84"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/sendRPX"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>

							<div className="port-price-col">
								<span className="market-price">Red Pulse {numeral(this.props.marketRPXPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.rpx * 100000) / 100000
								).format("0,0.0000")} <span className="rpx-price"> RPX</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">{numeral(this.props.rpx * this.props.marketRPXPrice).format("$0,0.00")} USD</span>
							</div>
							</div>
						</Link>



						<Link to="/sendSWH">
							<div className="col-3">

							<div className="port-logo-col">
							<img
								src={swhLogo}
								alt=""
								width="44"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/sendSWH"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>

							<div className="port-price-col">
								<span className="market-price">Switcheo {numeral(this.props.marketSWHPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.swh * 100000) / 100000
								).format("0,0.0000")} <span className="neo-price"> SWH</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">{numeral(this.props.swh * this.props.marketSWHPrice).format("$0,0.00")} USD</span>
							</div>
							</div>
						</Link>



						<Link to="/sendTHOR">
						<div className="col-3 ">
						<div className="port-logo-col">
						<img
							src={thorLogo}
							alt=""
							width="44"
							className="port-logos"
						/>
						<hr className="dash-hr" />
						<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/sendTHOR"><span className=" glyphicon glyphicon-send "/></Link></h3>
						</div>

						<div className="port-price-col">
							<span className="market-price">THOR $0.00</span>
							<h3>{numeral(
	              Math.floor(this.props.thor * 100000) / 100000
	            ).format("0,0.0000")} <span className="thor-price"> THOR</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">$0.00 USD</span>
						</div>
						</div>
						</Link>

						<Link to="/sendTKY">
							<div className="col-3">

							<div className="port-logo-col">
							<img
								src={tkyLogo}
								alt=""
								width="46"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/sendTKY"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>

							<div className="port-price-col">
								<span className="market-price">The Key {numeral(this.props.marketTKYPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.tky * 100000) / 100000
								).format("0,0.0000")} <span className="dbc-price"> TKY</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">{numeral(this.props.tky*this.props.marketTKYPrice).format("$0,0.00")} USD</span>
							</div>
							</div>
						</Link>


						<Link to="/SendTNC">
							<div className="col-3">

							<div className="port-logo-col">
							<img
								src={tncLogo}
								alt=""
								width="50"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/SendTNC"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>

							<div className="port-price-col">
								<span className="market-price">Trinity {numeral(this.props.marketTNCPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.tnc * 100000) / 100000
								).format("0,0.0000")} <span className="hp-price"> TNC</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">{numeral(this.props.tnc*this.props.marketTNCPrice).format("$0,0.00")} USD</span>
							</div>
							</div>
						</Link>





						<Link to="/sendZPT">
							<div className="col-3">

							<div className="port-logo-col">
							<img
								src={zptLogo}
								alt=""
								width="38"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/sendZPT"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>

							<div className="port-price-col">
								<span className="market-price">Zeepin {numeral(this.props.marketZPTPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.zpt * 100000) / 100000
								).format("0,0.0000")} <span className="neo-price"> ZPT</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">{numeral(this.props.zpt*this.props.marketZPTPrice).format("$0,0.00")} USD</span>
							</div>
							</div>
						</Link>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	gas: state.wallet.Gas,
	neo: state.wallet.Neo,
	cge: state.wallet.Cge,
	btc: state.wallet.Btc,
	acat: state.wallet.Acat,
	cge: state.wallet.Cge,
	dbc: state.wallet.Dbc,
	iam: state.wallet.Iam,
	ltc: state.wallet.Ltc,
	eth: state.wallet.Eth,
	nrve: state.wallet.Nrve,
	obt: state.wallet.Obt,
	ont: state.wallet.Ont,
	pkc: state.wallet.Pkc,
	qlc: state.wallet.Qlc,
	rht: state.wallet.Rht,
	rpx: state.wallet.Rpx,
	thor: state.wallet.Thor,
	tky: state.wallet.Tky,
	tnc: state.wallet.Tnc,
	zpt: state.wallet.Zpt,
	net: state.metadata.network,
	price: state.wallet.price,
	gasPrice: state.wallet.gasPrice,
	marketGASPrice: state.wallet.marketGASPrice,
	marketNEOPrice: state.wallet.marketNEOPrice,
	marketBTCPrice: state.wallet.marketBTCPrice,
	marketACATPrice: state.wallet.marketACATPrice,
	marketDBCPrice: state.wallet.marketDBCPrice,
	marketELAPrice: state.wallet.marketELAPrice,
	marketETHPrice: state.wallet.marketETHPrice,
	marketLTCPrice: state.wallet.marketLTCPrice,
	marketLRCPrice: state.wallet.marketLRCPrice,
	marketONTPrice: state.wallet.marketONTPrice,
	marketQLCPrice: state.wallet.marketQLCPrice,
	marketRPXPrice: state.wallet.marketRPXPrice,
	marketTNCPrice: state.wallet.marketTNCPrice,
	marketTKYPrice: state.wallet.marketTKYPrice,
	marketXMRPrice: state.wallet.marketXMRPrice,
	marketZPTPrice: state.wallet.marketZPTPrice,
	btcLoggedIn: state.account.btcLoggedIn,
	btcPrivKey: state.account.btcPrivKey,
	btcPubAddr: state.account.btcPubAddr,
	btcLoginRedirect: state.account.btcLoginRedirect
});

AssetPortolio = connect(mapStateToProps)(AssetPortolio);
export default AssetPortolio;
