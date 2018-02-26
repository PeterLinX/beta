import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../modules/wallet";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";


import neoLogo from "../img/neo.png";
import btcLogo from "../img/btc-logo.png";
import ltcLogo from "../img/litecoin.png";
import rpxLogo from "../img/rpx.png";
import tncLogo from "../img/tnc.png";
import tkyLogo from "../img/tky.png";
import zptLogo from "../img/zpt.png";
import qlinkLogo from "../img/qlc.png";
import thekeyLogo from "../img/thekey.png";
import ontLogo from "../img/ont.png";
import iamLogo from "../img/bridge.png";
import nexLogo from "../img/nex.png";
import deepLogo from "../img/deep.png";
import hashpuppiesLogo from "../img/hashpuppies.png";
import moneroLogo from "../img/monero.png";
import ethLogo from "../img/eth.png";


class AssetPortolio extends Component {
	constructor(props) {
		super(props);
		this.state = {
			gasPrice: 0,
			rpxPrice: 0,
			qlcPrice: 0,
			dbcPrice: 0
		};

	}

	render() {
		return (

			<div>

				<div className="row top-10 dash-portfolio center">

				<div className="clearboth" />
				<div className="row" />

							<div className="col-3">
							<div className="port-logo-col">
							<img
								src={neoLogo}
								alt=""
								width="36"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/send"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>
							<div className="port-price-col">
								<span className="market-price">NEO {numeral(this.props.marketNEOPrice).format("$0,0.00")}</span>
								<h3>{numeral(this.props.neo).format("0,0")} <span className="neo-price"> NEO</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">{numeral(this.props.price).format("$0,0.00")} USD</span>
							</div>
							</div>



							<div className="col-3">
							<div className="port-logo-col">
							<img
								src={neoLogo}
								alt=""
								width="36"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/send"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>
							<div className="port-price-col">
								<span className="market-price">GAS {numeral(this.props.marketGASPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.gas * 100000) / 100000
								).format("0,0.0000")} <span className="gas-price"> GAS</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">{" "}
									{numeral(Math.round(this.props.gasPrice * 100) / 100).format(
										"$0,0.00"
									)}{" "}
      USD</span>
							</div>
						</div>


						<Link to={"/newBitcoin"} >
						<div className="col-3">

						<div className="port-logo-col">
						<img
							src={btcLogo}
							alt=""
							width="44"
							className="port-logos"
						/>
						<hr className="dash-hr" />
						<h3><Link to="/receiveBitcoin"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/sendBTC"><span className=" glyphicon glyphicon-send "/></Link></h3>
						</div>

						<div className="port-price-col">
							<span className="market-price">Bitcoin {numeral(this.props.marketBTCPrice).format("$0,0.00")}</span>
							<h3>{numeral(this.props.btc).format("0,0.00000")} <span className="btc-price"> BTC</span></h3>
							<hr className="dash-hr" />
							<span className="market-price">{numeral(this.props.btc * this.props.marketBTCPrice).format("$0,0.00")} USD</span>
						</div>
						</div>
						</Link>


						<Link to="/tokens">
							<div className="col-3">

							<div className="port-logo-col">
							<img
								src={iamLogo}
								alt=""
								width="38"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/tokens"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>

							<div className="port-price-col">
								<span className="market-price">Bridge {numeral(this.props.marketTNCPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.tnc * 100000) / 100000
								).format("0,0.0000")} <span className="qlink-price"> IAM</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">$0.00 USD</span>
							</div>
							</div>
						</Link>



						<Link to="/sendDBC">
							<div className="col-3">

							<div className="port-logo-col">
							<img
								src={deepLogo}
								alt=""
								width="44"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/sendDBC"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>

							<div className="port-price-col">
								<span className="market-price">Deep Brain {numeral(this.props.marketDBCPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.bdc * 100000) / 100000
								).format("0,0.0000")} <span className="dbc-price"> DBC</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">$0.00 USD</span>
							</div>
							</div>
						</Link>


						<Link to="/sendHP">
							<div className="col-3">

							<div className="port-logo-col">
							<img
								src={hashpuppiesLogo}
								alt=""
								width="44"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/sendHP"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>

							<div className="port-price-col">
								<span className="market-price">Hash Puppies</span>
								<h3>{numeral(
									Math.floor(this.props.rhpt * 10) / 10
								).format("0,0")} <span className="hp-price"> RHPT</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">$0.00 USD</span>
							</div>
							</div>
						</Link>


						<Link to="/tokens">
							<div className="col-3">

							<div className="port-logo-col">
							<img
								src={ontLogo}
								alt=""
								width="38"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/tokens"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>

							<div className="port-price-col">
								<span className="market-price">Ontology {numeral(this.props.marketTNCPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.tnc * 100000) / 100000
								).format("0,0.0000")} <span className="dbc-price"> ONT</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">$0.00 USD</span>
							</div>
							</div>
						</Link>


						<Link to="/sendQLC">
							<div className="col-3">

							<div className="port-logo-col">
							<img
								src={qlinkLogo}
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
								<span className="market-price">$0.00 USD</span>
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
									Math.floor(this.props.rpxBal * 100000) / 100000
								).format("0,0.0000")} <span className="rpx-price"> RPX</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">{numeral(this.props.rpxBal * this.props.marketRPXPrice).format("$0,0.00")} USD</span>
							</div>
							</div>
						</Link>


						<Link to="/tokens">
							<div className="col-3">

							<div className="port-logo-col">
							<img
								src={tkyLogo}
								alt=""
								width="50"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/sendQLC"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>

							<div className="port-price-col">
								<span className="market-price">The Key {numeral(this.props.marketTNCPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.tnc * 100000) / 100000
								).format("0,0.0000")} <span className="dbc-price"> TKY</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">$0.00 USD</span>
							</div>
							</div>
						</Link>


						<Link to="/tokens">
							<div className="col-3">

							<div className="port-logo-col">
							<img
								src={tncLogo}
								alt=""
								width="50"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/sendQLC"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>

							<div className="port-price-col">
								<span className="market-price">Trinity {numeral(this.props.marketTNCPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.tnc * 100000) / 100000
								).format("0,0.0000")} <span className="qlink-price"> TNC</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">$0.00 USD</span>
							</div>
							</div>
						</Link>





						<Link to="/tokens">
							<div className="col-3">

							<div className="port-logo-col">
							<img
								src={zptLogo}
								alt=""
								width="38"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><Link to="/receive"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/tokens"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>

							<div className="port-price-col">
								<span className="market-price">Zeepin {numeral(this.props.marketTNCPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.tnc * 100000) / 100000
								).format("0,0.0000")} <span className="neo-price"> ZPT</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">$0.00 USD</span>
							</div>
							</div>
						</Link>


						<Link to="/SendLTC">
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

							<div className="port-price-col">
								<span className="market-price">Litecoin {numeral(this.props.marketLTCPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.ltc * 100000) / 100000
								).format("0,0.0000")} <span className="ltc-price"> LTC</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">$0.00 USD</span>
							</div>
							</div>
						</Link>

						<Link to="/tokens">
							<div className="col-3">

							<div className="port-logo-col">
							<img
								src={ethLogo}
								alt=""
								width="28"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><span className=" glyphicon glyphicon-qrcode marg-right-5"/>   <span className=" glyphicon glyphicon-send "/></h3>
							</div>

							<div className="port-price-col">
								<span className="market-price">Ethereum {numeral(this.props.marketETHPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.eth * 100000) / 100000
								).format("0,0.0000")} <span className="eth-price"> ETH</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">$0.00 USD</span>
							</div>
							</div>
						</Link>

						<Link to="/tokens">
							<div className="col-3">

							<div className="port-logo-col">
							<img
								src={moneroLogo}
								alt=""
								width="44"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><span className=" glyphicon glyphicon-qrcode marg-right-5"/>   <span className=" glyphicon glyphicon-send "/></h3>
							</div>

							<div className="port-price-col">
								<span className="market-price">Monero {numeral(this.props.marketXMRPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.eth * 100000) / 100000
								).format("0,0.0000")} <span className="xmr-price"> XMR</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">$0.00 USD</span>
							</div>
							</div>
						</Link>

				</div>

			</div>
		);
	}
}

const mapStateToProps = state => ({
	neo: state.wallet.Neo,
	gas: state.wallet.Gas,
	rpx: state.wallet.rbxBal,
	dbc: state.wallet.Dbc,
	qlc: state.wallet.Qlc,
	Rhpt: state.wallet.Rhpt,
	btc: state.wallet.Btc,
	address: state.account.address,
	net: state.metadata.network,
	price: state.wallet.price,
	gasPrice: state.wallet.gasPrice,
	marketGASPrice: state.wallet.marketGASPrice,
	marketNEOPrice: state.wallet.marketNEOPrice,
	marketRPXPrice: state.wallet.marketRPXPrice,
	marketDBCPrice: state.wallet.marketDBCPrice,
	marketQLCPrice: state.wallet.marketQLCPrice,
	marketBTCPrice: state.wallet.marketBTCPrice,
	marketLTCPrice: state.wallet.marketLTCPrice,
	marketETHPrice: state.wallet.marketETHPrice,
	marketLRCPrice: state.wallet.marketLRCPrice,
	marketXMRPrice: state.wallet.marketXMRPrice,
	btcLoggedIn: state.account.btcLoggedIn,
	btcPrivKey: state.account.btcPrivKey,
	btcPubAddr: state.account.btcPubAddr,
	btcLoginRedirect: state.account.btcLoginRedirect,
});

AssetPortolio = connect(mapStateToProps)(AssetPortolio);

export default AssetPortolio;
