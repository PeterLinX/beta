import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import Claim from "./Claim.js";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";
import { resetPrice } from "../modules/wallet";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";

// force sync with balance data
const refreshBalance = async (dispatch, net, address) => {
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
            <div className="col-xs-5">
              <p className="market-price center">
                NEO {numeral(this.props.marketNEOPrice).format("$0,0.00")}
              </p>
              <p className="neo-text">
                {numeral(this.props.neo).format("0,0")} <span>NEO</span>
              </p>
              <hr className="dash-hr" />
              <p className="neo-balance">
                {numeral(this.props.price).format("$0,0.00")} US
              </p>
            </div>
            <div className="col-xs-2">{<Claim />}</div>
            <div className="col-xs-5 top-5">
              <p className="market-price center">
                GAS {numeral(this.props.marketGASPrice).format("$0,0.00")}
              </p>
              <p className="gas-text">
                {numeral(
                  Math.floor(this.props.gas * 10000000) / 10000000
                ).format("0,0.000000")}{" "}
                <span>GAS</span>
              </p>
              <hr className="dash-hr" />
              <p className="neo-balance">
                {" "}
                {numeral(Math.round(this.props.gasPrice * 100) / 100).format(
                  "$0,0.00"
                )}{" "}
                USD
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
  gasPrice: state.wallet.gasPrice,
  marketGASPrice: state.wallet.marketGASPrice,
  marketNEOPrice: state.wallet.marketNEOPrice
});

TopBar = connect(mapStateToProps)(TopBar);

export default TopBar;
