import React, { Component } from "react";
import { connect } from "react-redux";
import QRCode from "qrcode.react";
import { clipboard } from "electron";
import { shell } from "electron";
import gdmLogo from "../img/gdm.png";
import ReactTooltip from "react-tooltip";
import gitsmLogo from "../img/gitsm.png";
import twitsmLogo from "../img/twitsm.png";

const getLink = (net, address) => {
	let base;
	if (net === "MainNet") {
		base = "https://neotracker.io/address/";
	} else {
		base = "https://testnet.neotracker.io/address/";
	}
	return base + address;
};

const openExplorer = srcLink => {
	shell.openExternal(srcLink);
};

class TokenSale extends Component {
	render() {
		console.log(this.props.net);
		return (
			<div >

			<div className="dash-panel">
			<h2>Participate in a NEP5 Token Sale</h2>

			<div className="row ">
				<hr className="dash-hr-wide top-20" />
			</div>

			<div className="row top-20">
				<div className="col-xs-3">
				<p>Select Token</p>
				<select
				 name="select-profession"
				 id="select-profession"
				 className=""
				>
						<option selected disabled={true}>

						</option>
								<option>
								Guardium (GDM)
								</option>
				</select>
				</div>

				<div className="col-xs-3">
				<p>Select payment method</p>
				<select
				 name="select-profession"
				 id="select-profession"
				 placeholder="Enter Amount to send"
				 className=""
				>
						<option selected disabled={true}>

						</option>
								<option value="NEO">
								NEO
								</option>
								<option value="GAS">
								GAS
								</option>
				</select>
				</div>

				<div className="col-xs-3">
				<p>Enter amount to send</p>
				<input  className="form-control-exchange" value="10" />
				</div>

				<div className="col-xs-3">
				<button className="btn-send top-30" >
					Confirm
				</button>
				</div>
				</div>

				<div className="row top-10">
				<div className="col-xs-11">
					<h3>Script Hash Manager</h3>
				</div>

				<div className="col-xs-1  top-10 center">
				<p><span className="glyphicon glyphicon-plus " /></p>
				</div>

				<div className="row ">
					<hr className="dash-hr-wide top-10" />
				</div>

				<div className="col-xs-3 top-10">
				<p>Thor (THOR)</p>
				</div>

				<div className="col-xs-8 top-10">
				<p><span className="glyphicon glyphicon-link marg-right-5" /> - 67a5086bac196b67d5fd20745b0dc9db4d2930ed</p>
				</div>

				<div className="col-xs-1  top-10 center">
				<p><span className="glyphicon glyphicon-trash " /></p>
				</div>

				<div className="row ">
					<hr className="dash-hr-wide top-10" />
				</div>

				<div className="col-xs-3 top-10">
				<p>Thor (THOR)</p>
				</div>

				<div className="col-xs-8 top-10">
				<p><span className="glyphicon glyphicon-link marg-right-5" /> - 67a5086bac196b67d5fd20745b0dc9db4d2930ed</p>
				</div>

				<div className="col-xs-1  top-10 center">
				<p><span className="glyphicon glyphicon-trash " /></p>
				</div>

				<div className="row ">
					<hr className="dash-hr-wide top-10" />
				</div>

				<div className="col-xs-3 top-10">
				<p>Thor (THOR)</p>
				</div>

				<div className="col-xs-8 top-10">
				<p><span className="glyphicon glyphicon-link marg-right-5" /> - 67a5086bac196b67d5fd20745b0dc9db4d2930ed</p>
				</div>

				<div className="col-xs-1  top-10 center">
				<p><span className="glyphicon glyphicon-trash " /></p>
				</div>





				</div>


			</div>

				<div className="clearboth" />
				<div className="col-xs-12">
					<p className="send-notice">
          Please ensure you follow the rules of the token sale you are participating in. Sending more than the maximum amount may result in the excess tokens being lost. Do not send tokens to a sale that has ended. Morpheus (SSL) is not liable for the loss of any tokens while participating in initial coin offerings (ICO) token sales. Please research every token sale carefully before participating.
					</p>
				</div>

			</div>
		);
	}
}

const mapStateToProps = state => ({
	blockHeight: state.metadata.blockHeight,
	net: state.metadata.network,
	address: state.account.address,
	neo: state.wallet.Neo,
	price: state.wallet.price,
	gas: state.wallet.Gas
});

TokenSale = connect(mapStateToProps)(TokenSale);
export default TokenSale;
