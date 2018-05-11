import React, { Component } from "react";
import { connect } from "react-redux";
import ReactTooltip from "react-tooltip";
import { Line } from "react-chartjs-2";
import axios from "axios";
import _ from "lodash";
import moment from "moment";
import neoLogo from "../images/neo.png";
import { Link } from "react-router";

import { doClaimAllGas, doSendAsset } from "neon-js";
import { setClaimRequest, disableClaim } from "../modules/claim";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";


var GasClaimChart = React.createClass({
  getInitialState(){
    return{
      donutval:0
    }
  },
  updateVal(e){
    this.setState({donutval:e.target.value})
  },
  render(){
    return(
      <div>
			<div className="gasclaimChart">
        <DonutChart value={this.props.claimAmount} />
			</div>
    </div>
    )
  }
});


const DonutChart = React.createClass({
  propTypes: {
    value: React.PropTypes.number,        // value the chart should show
    valuelabel: React.PropTypes.string,   // label for the chart
    size: React.PropTypes.number,         // diameter of chart
    strokewidth: React.PropTypes.number   // width of chart line
  },
  getDefaultProps() {
    return {
      value:0,
      valuelabel:'GAS',
      size:140,
      strokewidth:26
    };
  },
  render() {

    const halfsize = (this.props.size * 0.5);
    const radius = halfsize - (this.props.strokewidth * 0.5);
    const circumference = 2 * Math.PI * radius;
    const strokeval = ((this.props.value * circumference) / 1);
    const dashval = (strokeval + ' ' + circumference);

    const trackstyle = {strokeWidth: this.props.strokewidth};
    const indicatorstyle = {strokeWidth: this.props.strokewidth, strokeDasharray: dashval}
    const rotateval = 'rotate(-90 '+halfsize+','+halfsize+')';

    return (
      <svg width={this.props.size} height={this.props.size} className="donutchart">
        <circle r={radius} cx={halfsize} cy={halfsize} transform={rotateval} style={trackstyle} className="donutchart-track"/>
        <circle r={radius} cx={halfsize} cy={halfsize} transform={rotateval} style={indicatorstyle} className="donutchart-indicator"/>
        <text className="donutchart-text" x={halfsize} y={halfsize} style={{textAnchor:'middle'}} >
          <tspan className="donutchart-text-val">{this.props.value}</tspan>
          <tspan className="donutchart-text-percent">%</tspan>
          <tspan className="donutchart-text-label" x={halfsize} y={halfsize+10}>{this.props.valuelabel}</tspan>
        </text>
      </svg>
    );
  }
})

const mapStateToProps = state => ({
	claimAmount: state.claim.claimAmount,
	neo: state.wallet.Neo,
	gas: state.wallet.Gas,
	address: state.account.address,
	net: state.metadata.network,
	price: state.wallet.price
});

GasClaimChart = connect(mapStateToProps)(GasClaimChart);
export default GasClaimChart;
