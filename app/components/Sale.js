import React, { Component } from "react";
import { connect } from "react-redux";
import { syncTransactionHistory } from "../components/NetworkSwitch";
import { shell } from "electron";
import Copy from "react-icons/lib/md/content-copy";
import { clipboard } from "electron";
import Claim from "./Claim";
import TopBar from "./TopBar";
import axios from "axios";

// helper to open an external web link
const openExplorer = srcLink => {
  shell.openExternal(srcLink);
};

class Sale extends Component {
  componentDidMount = () => {
    syncTransactionHistory(
      this.props.dispatch,
      this.props.net,
      this.props.address
    );
  };

  render = () => (
    <div id="send">

      <div className="dash-panel fadeInDown">
        <div className="row">
        <h2 className="center">Participate in Token Sale</h2>

        <div className="col-xs-10 col-xs-offset-1">
          <input
            className="form-send-neo"
            id="center"
            placeholder="Please enter a valid token script hash"
          />
        </div>

        </div>

        <div className="row top-20">

        <div className="col-xs-3 col-xs-offset-1">
        Amount to Send
        <input
          className="form-send-neo"
          placeholder="Neo"
          type="number"
          id="assetAmount"
          min="1"
        />
        </div>
        <div className="col-xs-3">
        Calculated in USD
        <input
          className="form-send-neo"
          placeholder="$0.00"
          type="number"
          id="assetAmount"
          min="1"
        />
        </div>

        <div className="col-xs-4 top-20">
        <div id="sendAddress">
        <button
          className="grey-button"
        >
        <span className="glyphicon glyphicon-download marg-right-5"/>  Buy Tokens
        </button>
        </div>
        </div>
        <div className="col-xs-10 col-xs-offset-1">
        <div className="top-30 center">
                  <strong>Notice: You are currently on the {this.props.net}.</strong>
                  <br/>
                   Please ensure you are sending NEO to a valid token script hash address and that you are on the Main Network. Participating in token sales may be restricted or illegal in some countries. This interface may not work for all token sales. Submitting NEO multiple times to a sale may result in lost funds. Morpheus is not liable or responsible for any funds lost when participating with token sales. Once submitted your token balance will be updated in your portfolio.
                </div>

        </div>
        </div>

      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  blockHeight: state.metadata.blockHeight,
  address: state.account.address,
  net: state.metadata.network,
  neo: state.wallet.Neo,
  gas: state.wallet.Gas,
  price: state.wallet.price,
  transactions: state.wallet.transactions,
  explorer: state.metadata.blockExplorer
});

Sale = connect(mapStateToProps)(Sale);
export default Sale;
