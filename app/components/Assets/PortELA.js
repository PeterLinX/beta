import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import elaLogo from "../../img/ela.png";

class PortELA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eosPrice: 0
        };

    }


    render() {
        return (

            <div>


                <div className="col-3 flipInX">
                <Link to="/sendELA">
                    <div className="port-logo-col">
                        <img
                            src={elaLogo}
                            alt=""
                            width="42"
                            className="port-logos"
                        />
                        <hr className="dash-hr" />
                        <h3><span className=" glyphicon glyphicon-qrcode marg-right-5"/><span className=" glyphicon glyphicon-send "/></h3>
                    </div>
                    </Link>
                    <Link to="/sendELA">
                    <div className="port-price-col">
                        <span className="market-price">Elastos {numeral(this.props.marketELAPrice).format("$0,0.00")}</span>
                        <h3>{numeral(
                          Math.floor(this.props.ela * 100000) / 100000
                        ).format("0,0.000000")}<span className="eth-price"> ELA</span></h3>
                        <hr className="dash-hr" />
                        <span className="market-price">{numeral(this.props.ela * this.props.marketELAPrice).format("$0,0.00")} USD</span>
                    </div></Link>
                </div>



            </div>
        );
    }
}

const mapStateToProps = state => ({
  ela: state.wallet.Ela,
  marketELAPrice: state.wallet.marketELAPrice,
  elaLoggedIn: state.account.elaLoggedIn,
  elaPrivKey: state.account.elaPrivKey,
  elaPubAddr: state.account.elaPubAddr
});

PortELA = connect(mapStateToProps)(PortELA);
export default PortELA;
