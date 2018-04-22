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
			<h2>Participate in Token Sale</h2>


			<div className="row">
				<div className="col-xs-3">
				Select Token
				<select
				 name="select-profession"
				 id="select-profession"
				 className=""
				>
						<option selected disabled={true}>
								Please choose one...
						</option>
								<option>
								Guardium (GDM)
								</option>
				</select>
				</div>

				<div className="col-xs-3">
				<p>Select Asset to send</p>
				<select
				 name="select-profession"
				 id="select-profession"
				 placeholder="Enter Amount to send"
				 className=""
				>
						<option selected disabled={true}>
								Select payment method
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
				<button className="btn-send" >
					Send
				</button>
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
