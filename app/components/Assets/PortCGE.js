import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";
import { shell, clipboard } from "electron";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";
import NEPQRModal from "./NEPQRModal.js";
import cgeLogo from "../../img/cge.png";


const openExplorer = srcLink => {
  shell.openExternal(srcLink);
};

class PortCGE extends Component {
	constructor(props) {
		super(props);
		this.state = {
			cgePrice: 0
		};

	}


	render() {
		return (

			<div>


						<Link
						onClick={() =>
				    openExplorer("https://www.travala.com")
				    }
						><div className="col-3 flipInX">
							<div className="port-logo-col">
							<img
								src={cgeLogo}
								alt=""
								width="36"
								className="port-logos"
							/>

							<h3><NEPQRModal /><span className=" glyphicon glyphicon-send "/></h3>
							</div>
							<div className="port-price-col">
								<span className="market-price">Concierge {numeral(this.props.marketCGEPrice).format("$0,0.00")}</span>
								<h3>{numeral(
									Math.floor(this.props.cge * 100000) / 100000
								).format("0,0[.][0000]")} <span id="no-inverse" className="thor-price"> CGE</span></h3>

								<span className="market-price">{numeral(this.props.cge*this.props.marketCGEPrice).format("$0,0.00")} USD</span>
							</div>
							</div></Link>


			</div>
		);
	}
}

const mapStateToProps = state => ({
	cge: state.wallet.Cge,
	marketCGEPrice: state.wallet.marketCGEPrice
});

PortCGE = connect(mapStateToProps)(PortCGE);
export default PortCGE;
