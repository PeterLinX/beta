import React, { Component } from "react";
import { connect } from "react-redux";
import Claim from "./Claim.js";
import axios from "axios";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";
import { resetPrice } from "../modules/wallet";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import ReactTooltip from "react-tooltip";

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

  async componentDidMount() {
    let gas = await axios.get("https://api.coinmarketcap.com/v1/ticker/gas/");
    gas = gas.data[0].price_usd;
    const value = this.props.gas * gas;
    this.setState({ gasPrice: value });
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
              <p className="neo-balance">{this.props.price}</p>
            </div>
            <div className="col-xs-4">{<Claim />}</div>
            <div className="col-xs-4">
              <p className="neo-balance">Available GAS</p>
              <p className="gas-text">
                {Math.floor(this.props.gas * 1000000) / 1000000}{" "}
                <span>GAS</span>
              </p>
              <p className="neo-balance">
                {" "}
                ${Math.round(this.state.gasPrice * 100) / 100}
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
  price: state.wallet.price
});

TopBar = connect(mapStateToProps)(TopBar);

export default TopBar;
