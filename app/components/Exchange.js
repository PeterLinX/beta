import React, { Component } from "react";
import { connect } from "react-redux";
import Claim from "./Claim.js";
import MdSync from "react-icons/lib/md/sync";
import QRCode from "qrcode";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";
import { resetPrice } from "../modules/wallet";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import { clipboard } from "electron";
import Copy from "react-icons/lib/md/content-copy";
import ReactTooltip from "react-tooltip";
import neoLogo from "../images/neo.png";

// force sync with balance data
const refreshBalance = (dispatch, net, address) => {
  dispatch(sendEvent(true, "Refreshing..."));
  initiateGetBalance(dispatch, net, address).then(response => {
    dispatch(sendEvent(true, "Received latest blockchain information."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
  });
};

class Exchange extends Component {
  componentDidMount = () => {
    initiateGetBalance(this.props.dispatch, this.props.net, this.props.address);
    QRCode.toCanvas(this.canvas, this.props.address, { version: 5 }, err => {
      if (err) console.log(err);
    });
  };

  render = () => {
    if (this.props.address != null) {
      return (
        <div id="exchange-info">
          <webview id="foo"  src="https://changelly.com/widget/v1?auth=email&from=BTC&to=NEO&merchant_id=cdc0b166b122&address={this.props.address}&amount=1&ref_id=cdc0b166b122&color=292530"></webview>
          <div className="loading-exchange">
          <span className="glyphicon glyphicon-refresh rotating" />
          </div>
          </div>
      );
    } else {
      return null;
    }
  };
}

const mapStateToProps = state => ({
  neo: state.wallet.Neo,
  gas: state.wallet.Gas,
  address: state.account.address,
  net: state.metadata.network,
  price: state.wallet.price
});

Exchange = connect(mapStateToProps)(Exchange);

export default Exchange;
