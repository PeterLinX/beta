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

// force sync with balance data
const refreshBalance = (dispatch, net, address) => {
  dispatch(sendEvent(true, "Refreshing..."));
  initiateGetBalance(dispatch, net, address).then(response => {
    dispatch(sendEvent(true, "Received latest blockchain information."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
  });
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
              </div>
              <div className="col-xs-4">{<Claim />}</div>
              <div className="col-xs-4">
                <p className="neo-balance">Available GAS</p>
                <p className="gas-text">
                  {Math.floor(this.props.gas * 10000) / 10000}
                  <span>GAS</span>
                </p>
              </div>
            </div>
          </div>

          <div className="label">Your Public Neo Address:</div>
          <div className="address">
            {this.props.address}
            <span
              className="copyKey"
              onClick={() => clipboard.writeText(this.props.address)}
            >
              <Copy data-tip data-for="copyAddressTip" />
            </span>
          </div>
          <ReactTooltip
            className="solidTip"
            id="copyAddressTip"
            place="bottom"
            type="dark"
            effect="solid"
          >
            <span>Copy Public Address</span>
          </ReactTooltip>
          <div className="spacer" />
          <div className="row">
            <div className="col-md-6">
              <div className="label">
                <p>NEO</p>
              </div>
              <div className="amountBig">
                <p>{this.props.neo}</p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="label">
                <p>GAS</p>
              </div>
              <div className="amountBig">
                <p>{Math.floor(this.props.gas * 10000) / 10000}</p>
              </div>
            </div>
          </div>
          <div id="balance">
            <div
              onClick={() =>
                refreshBalance(
                  this.props.dispatch,
                  this.props.net,
                  this.props.address
                )
              }
            >
              <MdSync id="refresh" data-tip data-for="refreshBalanceTip" />
              <ReactTooltip
                className="solidTip"
                id="refreshBalanceTip"
                place="bottom"
                type="dark"
                effect="solid"
              >
                <span>Refresh account balance</span>
              </ReactTooltip>
            </div>

            <div className="fiat">US</div>
          </div>
          <div className="spacer" />

          <div className="spacer" />
          {/* <div className="qrCode">
            <canvas id="qrCanvas" ref={node => (this.canvas = node)} />
          </div> */}
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
