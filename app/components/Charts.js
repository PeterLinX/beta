import React, { Component } from "react";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import demoChart from "../images/demoChart.png";


class Charts extends Component {

render() {
    return (
      <div>
      <div className="settings-panel">
      <div className="row">
        <div className="col-xs-12">
        <img src={demoChart} alt="" width="620" className="demo-chart" />
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

Charts = connect(mapStateToProps)(Charts);

export default Charts;
