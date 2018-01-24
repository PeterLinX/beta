import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../modules/wallet";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";
import { fetchNeoStatus } from "../modules/shapeshift";

import neoLogo from "../img/neo.png";
import NeoLogo from "./Brand/Neo";
import BtcLogo from "./Brand/Bitcoin";
import shapeshiftLogo from "../img/shapeshift.png";

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

  componentDidMount() {
    console.log(this.props);
    this.props.fetchNeoStatus();
  }

  render() {
    return (
      <div>
      <div className="progress-bar fadeInLeft-ex" />

      <div className="row prog-info top-20">
        <div className="col-xs-2 col-xs-offset-1 sm-text center">
          Enter Amount to Deposit
        </div>
        <div className="col-xs-2 sm-text center grey-out">
        Placing Your Order</div>
        <div className="col-xs-2 sm-text center grey-out">
          Generating Deposit Address
        </div>
        <div className="col-xs-2 sm-text center grey-out">
          Processing Your Order
        </div>
        <div className="col-xs-2 sm-text center grey-out">
          Transaction Complete!
        </div>
      </div>

      <div className="top-130 dash-panel">
      <h2 className="center">ShapeShift Exchange Service</h2>
      <hr className="dash-hr-wide" />
        <div className="row top-10">

          <div className="col-xs-4">
            <select
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
            </select>
            <p className="sm-text top-10">
            Select Asset to Exchange
            </p>
          </div>

          <div className="col-xs-4">
          <input
            className="form-control-exchange center"
            placeholder="0.000001"
            type="number"
            min={0.01}
          />
          <p className="sm-text">
          Amount to Deposit
          </p>
          </div>


          <div className="col-xs-4">
          <input
            className="form-control-exchange center"
            value="0"
            placeholder="0"
            disabled
          />
          <p className="sm-text">
          Amount of NEO Received
          </p>
          </div>

        </div>

        <div className="row">
          <div className="col-xs-8 top-20">

            <input
              className="form-control-exchange center"
              disabled
              placeholder={this.props.address}
            />
            <p className="sm-text">
              Once complete, NEO will be deposited to the address above
            </p>
          </div>
          <div className="col-xs-4 center top-20">
            <button
              className="btn-send"
            >
              Place Oder
            </button>
          </div>
        </div>
        
        <div className="row">
          <div className="col-xs-9 top-20">
            <strong>
              Minimum Order: 0.000000
            </strong><br />
            <span className="sm-text">Transaction fees included.</span>
          </div>

          <div className="col-xs-3">
          <img
            src={shapeshiftLogo}
            alt=""
            width="160"
            className="logobounce"
          />
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
  marketQLCPrice: state.wallet.marketQLCPrice,
    fetching: state.shapeshift.fetching,
    available: state.shapeshift.available,
    error: state.shapeshift.error
});

const mapDispatchToProps = ({
    fetchNeoStatus
});

ShapeShift = connect(mapStateToProps, mapDispatchToProps)(ShapeShift);

export default ShapeShift;
