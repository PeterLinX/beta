import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../modules/wallet";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";

import PortACAT from "./Assets/PortACAT";
import PortApex from "./Assets/PortApex";
import PortAPH from "./Assets/PortAPH";
import PortBTC from "./Assets/PortBTC";
import PortIAM from "./Assets/PortIAM";
import PortCGE from "./Assets/PortCGE";
import PortAVA from "./Assets/PortAVA";
import PortDBC from "./Assets/PortDBC";
import PortEDS from "./Assets/PortEDS";
import PortEFX from "./Assets/PortEFX";
import PortELA from "./Assets/PortELA";
import PortEOS from "./Assets/PortEOS";
import PortETH from "./Assets/PortETH";
import PortGALA from "./Assets/PortGALA";
import PortGAGA from "./Assets/PortGAGA";
import PortGAS from "./Assets/PortGAS";
import PortGDM from "./Assets/PortGDM";
import PortHP from "./Assets/PortHP";
import PortLTC from "./Assets/PortLTC";
import PortLRN from "./Assets/PortLRN";
import PortMCT from "./Assets/PortMCT";
import PortNRVE from "./Assets/PortNRVE";
import PortNEO from "./Assets/PortNEO";
import PortNEX from "./Assets/PortNEX";
import PortOBT from "./Assets/PortOBT";
import PortONT from "./Assets/PortONT";
import PortPKC from "./Assets/PortPKC";
import PortQLC from "./Assets/PortQLC";
import PortRPX from "./Assets/PortRPX";
import PortQTUM from "./Assets/PortQTUM";
import PortSWH from "./Assets/PortSWH";
import PortTHOR from "./Assets/PortTHOR";
import PortTKY from "./Assets/PortTKY";
import PortTNC from "./Assets/PortTNC";
import PortWWB from "./Assets/PortWWB";
import PortXQT from "./Assets/PortXQT";
import PortZPT from "./Assets/PortZPT";

import Search from "./Search";
import TopBar from "./TopBar";

class AssetPortolio extends Component {
	render() {
		return (

			<div>

			<div className="breadBar">
			<div className="col-flat-10">
			<ol className="breadcrumb">
			</ol>
			</div>
			<div className="col-flat-2">
			<Search />
			</div>
			</div>

			<TopBar />

				<div className="row top-20 dash-portfolio center">

				<div id="postfolioList">
				<PortACAT />
				<PortApex />
				<PortAPH />
				<PortBTC />
				<PortIAM />
				<PortCGE />
				<PortDBC />
				<PortEFX />
				<PortEDS />
				<PortETH />
				<PortGAGA />
				<PortGALA />
				<PortGAS />
				<PortGDM />
				<PortHP />
				<PortLTC />
				<PortLRN />
				<PortMCT />
				<PortNRVE />
				<PortNEO />
				<PortNEX />
				<PortOBT />
				<PortONT />
				<PortPKC />
				<PortQLC />
				<PortXQT />
				<PortRPX />
				<PortSWH />
				<PortTHOR />
				<PortTKY />
				<PortTNC />
				<PortAVA />
				<PortWWB />
				<PortZPT />


				</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
	gas: state.wallet.Gas,
	neo: state.wallet.Neo,
});

AssetPortolio = connect(mapStateToProps)(AssetPortolio);
export default AssetPortolio;
