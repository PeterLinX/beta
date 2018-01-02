import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import Claim from "./Claim.js";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";
import { resetPrice } from "../modules/wallet";
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

// force sync with balance data
const refreshBalance = async (dispatch, net, address) => {
  dispatch(sendEvent(true, "Refreshing..."));
  initiateGetBalance(dispatch, net, address).then(response => {
    dispatch(sendEvent(true, "Received latest blockchain information."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
  });
};

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

      <div className="col-5">
      <h3>0<br />
      <span className="rpx-price">RPX</span></h3>
      <hr className="dash-hr" />
      <span className="dash-price">$0.00 USD</span>
      </div>

      <div className="col-5">
      <h3>0<br />
      <span className="dbc-price">DBC</span></h3>
      <hr className="dash-hr" />
      <span className="dash-price">$0.00 USD</span>
      </div>

      <div className="col-5">
      <h3>0<br />
      <span className="qlink-price">QLK</span></h3>
      <hr className="dash-hr" />
      <span className="dash-price">$0.00 USD</span>
      </div>

      <div className="col-5">
      <h3>0.00000000<br />
      <span className="hp-price">HashPuppy</span></h3>
      <hr className="dash-hr" />
      <span className="dash-price">$0.00 USD</span>
      </div>

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
  marketNEOPrice: state.wallet.marketNEOPrice
});

Assets = connect(mapStateToProps)(Assets);

export default Assets;
