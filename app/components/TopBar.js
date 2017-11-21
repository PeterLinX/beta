import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import Claim from "./Claim.js";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";
import { resetPrice } from "../modules/wallet";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";

// force sync with balance data
const refreshBalance = (dispatch, net, address) => {
  dispatch(sendEvent(true, "Refreshing..."));
  initiateGetBalance(dispatch, net, address).then(response => {
    dispatch(sendEvent(true, "Received latest blockchain information."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
  });
};

class TopBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gasPrice: 0
    };
  }

  render() {
    return (
      <div id="send">
        <div className="row">
          <div className="header">
            <div className="col-xs-4">
              <p className="neo-balance">Available Neo</p>
              <p className="neo-text">
                {this.props.neo} <span>NEO</span>
              </p>
              <p className="neo-balance">
                {numeral(this.props.price).format("$0,0.00")}
              </p>
            </div>
            <div className="col-xs-4">{<Claim />}</div>
            <div className="col-xs-4">
              <p className="neo-balance">Available GAS</p>
              <p className="gas-text">
                {Math.floor(this.props.gas * 100000) / 100000} <span>GAS</span>
              </p>
              <p className="neo-balance">
                {" "}
                {numeral(Math.round(this.props.gasPrice * 100) / 100).format(
                  "$0,0.00"
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  neo: state.wallet.Neo,
  gas: state.wallet.Gas,
  address: state.account.address,
  net: state.metadata.network,
  price: state.wallet.price,
  gasPrice: state.wallet.gasPrice
});

TopBar = connect(mapStateToProps)(TopBar);

export default TopBar;
