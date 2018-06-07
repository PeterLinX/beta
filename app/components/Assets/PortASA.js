import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";
import { shell, clipboard } from "electron";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";
import NEPQRModal from "./NEPQRModal.js";
import asaLogo from "../../img/asa.png";


const openExplorer = srcLink => {
  shell.openExternal(srcLink);
};

class PortASA extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cgePrice: 0
		};

	}


	render() {
		return (

			<div>


						<Link to="/sendASA">
            <div className="col-3 flipInX">
							<div className="port-logo-col">
							<img
								src={asaLogo}
								alt=""
								width="32"
								className="port-logos top-10"
							/>

							<h3><NEPQRModal /><span className=" glyphicon glyphicon-send "/></h3>
							</div>
							<div className="port-price-col">
								<span className="market-price">Asura World {numeral(this.props.marketASAPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.asa * 100000) / 100000
								).format("0,0[.][0000]")} <span id="no-inverse" className="rpx-price"> ASA</span></h3>

								<span className="market-price">{numeral(this.props.asa*this.props.marketASAPrice).format("$0,0.00")} USD</span>
							</div>
							</div></Link>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	asa: state.wallet.Asa,
	marketASAPrice: state.wallet.marketASAPrice
});

PortASA = connect(mapStateToProps)(PortASA);
export default PortASA;
