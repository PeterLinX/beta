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
import demoChart from "../images/demoChart.png";

// force sync with balance data
const refreshBalance = (dispatch, net, address) => {
  dispatch(sendEvent(true, "Refreshing..."));
  initiateGetBalance(dispatch, net, address).then(response => {
    dispatch(sendEvent(true, "Received latest blockchain information."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
  });
};


// In a new Javascript file create a variable for new websocket
var ws = new WebSocket('wss://api.bitfinex.com/ws');

// Create function to send on open
ws.onopen = function() {
  ws.send(JSON.stringify({"event":"subscribe", "channel":"ticker", "pair":"NEOUSD"}));
};

// Tell function what to do when message is received and log messages to "neo-price" div
ws.onmessage = function(msg) {
  // create a variable for response and parse the json data
  var response = JSON.parse(msg.data);
  // save hb variable from bitfinex
  var hb = response[1];
  if(hb != "hb") {
    document.getElementById("neo-price").innerHTML = "<li>ASK: $" + response[3] + "</li><li> LAST: $" + response[7] + "</li><li> BID: $" + response[1] + "</li>";
  }
};

class WalletInfo extends Component {
  componentDidMount = () => {
    initiateGetBalance(this.props.dispatch, this.props.net, this.props.address);
    QRCode.toCanvas(this.canvas, this.props.address, { version: 5 }, err => {
      if (err) console.log(err);
    });
  };

  render = () => {
    if (this.props.address != null) {
      return (
        <div id="accountInfo" style={{ width: "75%" }}>
          <div className="row ">
            <div className="header">
              <div className="col-xs-4">
                <p className="neo-balance">Available Neo</p>
                <p className="neo-text">
                  {this.props.neo} <span>NEO</span>
                </p>
                <p className="neo-balance">{this.props.price}</p>
              </div>
              <div className="col-xs-4">{<Claim />}</div>
              <div className="col-xs-4">
                <p className="neo-balance">Available GAS</p>
                <p className="gas-text">
                  {Math.floor(this.props.gas * 1000000) / 1000000} <span>GAS</span>
                </p>
              </div>
            </div>
          </div>

          <div className="row send-neo">
          <div className="col-xs-12">
          <ul id="neo-price"></ul>

          </div>
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

WalletInfo = connect(mapStateToProps)(WalletInfo);

export default WalletInfo;
