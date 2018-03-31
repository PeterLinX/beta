import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";
import NEPQRModal from "./NEPQRModal.js";
import ontLogo from "../../img/ont.png";

class PortONT extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ontPrice: 0
		};

	}


	render() {
		return (

			<div>


							<div className="col-3">

							<div className="port-logo-col">
							<img
								src={ontLogo}
								alt=""
								width="48"
								className="port-logos"
							/>
							<hr className="dash-hr" />
							<h3><NEPQRModal />   <Link to="/sendONT"><span className=" glyphicon glyphicon-send "/></Link></h3>
							</div>
							<Link to="/sendONT">
							<div className="port-price-col">
								<span className="market-price">Ontology {numeral(this.props.marketONTPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.ont * 100000) / 100000
								).format("0,0.0000")} <span className="dbc-price"> ONT</span></h3>
								<hr className="dash-hr" />
								<span className="market-price">{numeral(this.props.ont*this.props.marketONTPrice).format("$0,0.00")} USD</span>
							</div></Link>
							</div>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	ont: state.wallet.Ont,
	marketONTPrice: state.wallet.marketONTPrice,
});

PortONT = connect(mapStateToProps)(PortONT);
export default PortONT;
