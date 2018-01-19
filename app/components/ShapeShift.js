import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../modules/wallet";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";

import neoLogo from "../img/neo.png";
import NeoLogo from "./Brand/Neo";
import BtcLogo from "./Brand/Bitcoin";

// force sync with balance data
const refreshBalance = async (dispatch, net, address) => {
  dispatch(sendEvent(true, "Refreshing..."));
  initiateGetBalance(dispatch, net, address).then(response => {
    dispatch(sendEvent(true, "Received latest blockchain information."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
  });
};


class ShapeShift extends Component {
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
      <div className="progress-bar fadeInLeft-ex" />
      <div className="row prog-info top-20">
        <div className="col-xs-2 col-xs-offset-1 sm-text center">
          Enter Amount to Deposit
        </div>
        <div className="col-xs-2 sm-text center">Placing Your Order</div>
        <div className="col-xs-2 sm-text center">
          Generating Deposit Address
        </div>
        <div className="col-xs-2 sm-text center grey-out">
          Processing Your Order
        </div>
        <div className="col-xs-2 sm-text center grey-out">
          Transaction Complete!
        </div>
      </div>

      <div className="top-130 dash-panel fadeInDown">
        <div className="com-soon row fadeInDown">
          <div className="col-xs-4 col-xs-offset-1">
            <h4 className="top-20"><select
              name="select-profession"
              id="select-profession"
              className=""
            >
              <option selected disabled={true}>
                Select Asset
              </option>
                <option>
                Bitcoin (BTC)
                </option>
                <option>
                Ethereum (ETH)
                </option>
                <option>
                Litecoin (LTC)
                </option>
                <option>
                Monero (XMR)
                </option>
            </select></h4>
          </div>
          <div className="col-xs-2" />
          <div className="col-xs-4">
            <div className="exch-logos">
              <NeoLogo width={32} />
            </div>
            <h4 className="top-20">Receive NEO</h4>
          </div>
          <div className="col-xs-1" />
          <div className="clearboth" />
          <div className="col-xs-4 top-10 center col-xs-offset-1">
            <input
              className="form-control-exchange center"
              placeholder="0.000001"
              type="number"
              min={0.01}
            />
          </div>
          <div className="col-xs-2 center">
            <div className="exchange-glyph">
              <span className="glyphicon glyphicon-transfer" />
            </div>
          </div>

          <div className="col-xs-4 center">
            <input
              className="form-control-exchange center"
              value="0"
              placeholder="0"
              disabled
            />
          </div>
        </div>

        <div className="row">
          <div className="col-xs-10 center col-xs-offset-1  top-20">
            <input
              className="form-control-exchange center"
              disabled
              placeholder={this.props.address}
            />
            <p className="sm-text">
              Once complete, NEO will be deposited to the address above
            </p>
          </div>
        </div>
        <div className="row top-20">
          <div className="col-xs-3 col-xs-offset-1 ">
            <strong>
              Minimum Order:<br />
              0.000000
            </strong>
            <br />
            <span className="sm-text">Transaction fees included.</span>
          </div>
          <div className="col-xs-4 center">
            <button
              className="btn-send"
            >
              Continue
            </button>
          </div>
          <div className="col-xs-3">
            <p className="sm-text">Powered by:</p>
            <div className="shapeshift-logo-sm" />
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
  rpx: state.wallet.Rpx,
  dbc: state.wallet.Dbc,
  qlc: state.wallet.Qlc,
  Rhpt: state.wallet.Rhpt,
  address: state.account.address,
  net: state.metadata.network,
  price: state.wallet.price,
  gasPrice: state.wallet.gasPrice,
  marketGASPrice: state.wallet.marketGASPrice,
  marketNEOPrice: state.wallet.marketNEOPrice,
  marketRPXPrice: state.wallet.marketRPXPrice,
  marketDBCPrice: state.wallet.marketDBCPrice,
  marketQLCPrice: state.wallet.marketQLCPrice
});

ShapeShift = connect(mapStateToProps)(ShapeShift);

export default ShapeShift;
