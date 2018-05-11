import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../../modules/wallet";
import { initiateGetBalance, intervals } from "../../components/NetworkSwitch";

import eosLogo from "../../img/eos.png";

class PortEOS extends Component {
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
                    <div className="port-logo-col">
                        <img
                            src={eosLogo}
                            alt=""
                            width="42"
                            className="port-logos"
                        />

                        <h3><Link to="/receiveEthereum"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/sendEOS"><span className=" glyphicon glyphicon-send "/></Link></h3>
                    </div><Link to="/sendEOS">
                    <div className="port-price-col">
                        <span className="market-price">EOS {numeral(this.props.marketEOSPrice).format("$0,0.00")}</span>
                        <h3>{numeral(this.props.eos/10000000000).format("0,0[.][0000]")}<span className="eth-price"> EOS</span></h3>

                        <span className="market-price">{numeral((this.props.eos/10000000000) * this.props.marketEOSPrice).format("$0,0.00")} USD</span>
                    </div></Link>
                </div>



            </div>
        );
    }
}

const mapStateToProps = state => ({
    eos: state.wallet.Eos,
    marketEOSPrice: state.wallet.marketEOSPrice
});

PortEOS = connect(mapStateToProps)(PortEOS);
export default PortEOS;
