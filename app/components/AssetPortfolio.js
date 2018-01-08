import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import Claim from "./Claim.js";
import Assets from "./Assets";
import PortfolioCharts from "./PortfolioCharts";

import { setMarketPrice, resetPrice } from "../modules/wallet";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";
import TopBar from "./TopBar";

import btcLogo from "../img/btc-logo.png";
import ltcLogo from "../img/litecoin.png";
import rpxLogo from "../img/rpx.png";
import qlinkLogo from "../img/qlink.png";
import thekeyLogo from "../img/thekey.png";
import nexLogo from "../img/nex.png";
import deepLogo from "../img/deep.png";
import hashpuppiesLogo from "../img/hashpuppies.png";
import doughnut from "../img/doughnut.png";


// force sync with balance data
const refreshBalance = async (dispatch, net, address) => {
  dispatch(sendEvent(true, "Refreshing..."));
  initiateGetBalance(dispatch, net, address).then(response => {
    dispatch(sendEvent(true, "Received latest blockchain information."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
  });
};


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

<TopBar />

      <div className="row top-10 asset-portfolio center">

      <div className="col-xs-3 top-30">

      <Link to="/send">
      <div className="col-5">
      <span className="market-price">NEO {numeral(this.props.marketNEOPrice).format("$0,0.00")}</span>
      <h3>{numeral(this.props.neo).format("0,0")} <span className="neo-price"> NEO</span></h3>
      <hr className="dash-hr" />
      <span className="market-price">{numeral(this.props.price).format("$0,0.00")} USD</span>
      </div>
      </Link>

      <Link to="/send">
      <div className="col-5">
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
      </Link>

      <Link to="/sendRPX">
      <div className="col-5">
      <span className="market-price">RPX {numeral(this.props.marketRPXPrice).format("$0,0.00")}</span>
      <h3>{numeral(
        Math.floor(this.props.rpx * 100000) / 100000
      ).format("0,0.0000")} <span className="rpx-price"> RPX</span></h3>
      <hr className="dash-hr" />
      <span className="market-price">$0.00 USD</span>
      </div>
      </Link>

      </div>

      <div className="col-xs-6">

      <img
        src={doughnut}
        alt=""
        width="300"
        className="logobounce center asset-doughnut"
      />


      </div>

      <div className="col-xs-3 top-30">



        <Link to="/sendDBC">
        <div className="col-5">
        <span className="market-price">DBC {numeral(this.props.marketDBCPrice).format("$0,0.00")}</span>
        <h3>{numeral(
          Math.floor(this.props.bdc * 100000) / 100000
        ).format("0,0.0000")} <span className="dbc-price"> DBC</span></h3>
        <hr className="dash-hr" />
        <span className="market-price">$0.00 USD</span>
        </div>
        </Link>

        <Link to="/sendQLC">
        <div className="col-5">
        <span className="market-price">QLC {numeral(this.props.marketQLCPrice).format("$0,0.00")}</span>
        <h3>{numeral(
          Math.floor(this.props.qlc * 100000) / 100000
        ).format("0,0.0000")} <span className="qlink-price"> QLC</span></h3>
        <hr className="dash-hr" />
        <span className="market-price">$0.00 USD</span>
        </div>
        </Link>

        <Link to="/sendHP">
        <div className="col-5">
        <span className="market-price">Priceless</span>
        <h3>{numeral(
          Math.floor(this.props.rhpt * 10) / 10
        ).format("0,0")} <span className="hp-price"> RHPT</span></h3>
        <hr className="dash-hr" />
        <span className="market-price">$0.00 USD</span>
        </div>
        </Link>



        </div>

        </div>

        <div className="row top-10 asset-portfolio center">

        <div className="col-xs-12">

        <Link to="/tokens">
        <div className="col-5">
        <span className="market-price">BTC {numeral(this.props.marketBTCPrice).format("$0,0.00")}</span>
        <h3>{numeral(
          Math.floor(this.props.btc * 100000) / 100000
        ).format("0,0.0000")} <span className="rpx-price"> BTC</span></h3>
        <hr className="dash-hr" />
        <span className="market-price">$0.00 USD</span>
        </div>
        </Link>

        <Link to="/tokens">
        <div className="col-5">
        <span className="market-price">LTC {numeral(this.props.marketLTCPrice).format("$0,0.00")}</span>
        <h3>{numeral(
          Math.floor(this.props.ltc * 100000) / 100000
        ).format("0,0.0000")} <span className="dbc-price"> LTC</span></h3>
        <hr className="dash-hr" />
        <span className="market-price">$0.00 USD</span>
        </div>
        </Link>

        <Link to="/tokens">
        <div className="col-5">
        <span className="market-price">ETH {numeral(this.props.marketETHPrice).format("$0,0.00")}</span>
        <h3>{numeral(
          Math.floor(this.props.eth * 100000) / 100000
        ).format("0,0.0000")} <span className="qlink-price"> ETH</span></h3>
        <hr className="dash-hr" />
        <span className="market-price">$0.00 USD</span>
        </div>
        </Link>

        <Link to="/tokens">
        <div className="col-5">
        <span className="market-price">ETH {numeral(this.props.marketETHPrice).format("$0,0.00")}</span>
        <h3>{numeral(
          Math.floor(this.props.eth * 100000) / 100000
        ).format("0,0.0000")} <span className="qlink-price"> ETH</span></h3>
        <hr className="dash-hr" />
        <span className="market-price">$0.00 USD</span>
        </div>
        </Link>

        <Link to="/tokens">
        <div className="col-5 dotted">
        <h2 className="center">
        <span className="glyphicon glyphicon-plus-sign" /></h2>
        </div>
        </Link>

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
  marketBTCPrice: state.wallet.marketBTCPrice,
  marketLTCPrice: state.wallet.marketLTCPrice,
  marketETHPrice: state.wallet.marketETHPrice
});

AssetPortolio = connect(mapStateToProps)(AssetPortolio);

export default AssetPortolio;
