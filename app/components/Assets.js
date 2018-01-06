import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import Claim from "./Claim.js";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";
import { setMarketPrice } from "../modules/wallet";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import btcLogo from "../img/btc-logo.png";
import ltcLogo from "../img/litecoin.png";
import rpxLogo from "../img/rpx.png";
import qlinkLogo from "../img/qlink.png";
import thekeyLogo from "../img/thekey.png";
import nexLogo from "../img/nex.png";
import deepLogo from "../img/deep.png";
import hashpuppiesLogo from "../img/hashpuppies.png";
import { Link } from "react-router";


class Assets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gasPrice: 0
    };
  }

  render() {
    return (

<div>

      <div className="row top-10 dash-portfolio center">

      <Link to="/sendRPX">
      <div className="col-5">
      <span className="market-price">RPX {numeral(this.props.marketRPXPrice).format("$0,0.00")}</span>
      <h3>0.0000 <span className="rpx-price"> RPX</span></h3>
      <hr className="dash-hr" />
      <span className="market-price">$0.00 USD</span>
      </div>
      </Link>
      <Link to="/sendDBC">
      <div className="col-5">
      <span className="market-price">DBC {numeral(this.props.marketDBCPrice).format("$0,0.00")}</span>
      <h3>0.0000 <span className="dbc-price"> DBC</span></h3>
      <hr className="dash-hr" />
      <span className="market-price">$0.00 USD</span>
      </div>
      </Link>
      <Link to="/sendQLC">
      <div className="col-5">
      <span className="market-price">QLC {numeral(this.props.marketQLCPrice).format("$0,0.00")}</span>
      <h3>0.0000 <span className="qlink-price"> QLC</span></h3>
      <hr className="dash-hr" />
      <span className="market-price">$0.00 USD</span>
      </div>
      </Link>
      <Link to="/sendHP">
      <div className="col-5">
      <span className="market-price">Priceless</span>
      <h3>0.0000 <span className="hp-price"> RHPT</span></h3>
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
  marketNEOPrice: state.wallet.marketNEOPrice,
  marketRPXPrice: state.wallet.marketRPXPrice,
  marketDBCPrice: state.wallet.marketDBCPrice,
  marketQLCPrice: state.wallet.marketQLCPrice
});

Assets = connect(mapStateToProps)(Assets);

export default Assets;
