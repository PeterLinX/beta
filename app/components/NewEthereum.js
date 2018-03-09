import React, { Component } from "react";
import { connect } from "react-redux";
import QRCode from "qrcode.react";
import { clipboard } from "electron";
import { shell } from "electron";
import ethLogo from "../img/eth.png";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router";
import axios from 'axios';
import { setEthBalance } from "../modules/wallet";
import {
    sendEvent,
    clearTransactionEvent,
    toggleAsset
} from "../modules/transactions";
import { ethLogIn, ethLoginRedirect } from '../modules/account';
import { getWIFFromPrivateKey } from "neon-js";
import { encrypt_wif, decrypt_wif } from "neon-js";
import { getAccountsFromWIFKey } from "neon-js";
import { setEthBlockHeight } from "../modules/metadata";
import { BLOCK_TOKEN } from "../core/constants";

var bitcoin = require('bitcoinjs-lib');
var ethereum = require("ethereumjs-util");
var key = "c6294d6b9e829b485a6dc5842a44e2de5f8e5c57";
var secret = "073a794fbd48c76ccdde0f9d8fa12c19de554487";

const getBalanceLink = (net, address) => {
    let url;

    if (net === "MainNet") {
        url = "https://api.blockcypher.com/v1/eth/main/addrs/" + address + "/balance?token=" + BLOCK_TOKEN;
    } else {
        url = "https://api.blockcypher.com/v1/beth/test/addrs/" + address +"/balance?token=" + BLOCK_TOKEN;
    }
    return url;
}

const openExplorer = srcLink => {
    shell.openExternal(srcLink);
};

class NewEthereum extends Component {
    constructor(props){
        super(props);
        this.state={
            pa: '',
            pk: ''
        }

        if(this.props.ethLoggedIn){
            this.props.history.push("/receiveEthereum");
        }

    }

    getRandomAddress = async ()=>{
        let base,pa,pk;
        if (this.props.net === "MainNet") {
            base = "https://api.blockcypher.com/v1/eth/main/addrs?token=" + BLOCK_TOKEN;
        } else {
            base = "https://api.blockcypher.com/v1/beth/test/addrs?token=" + BLOCK_TOKEN;
        }

        let response = await axios.post(base);
        pa = response.data.address;
        pk = response.data.private;
        this.setState({
            pa: pa,
            pk: pk,
        });
    };

    login = async (dispatch) => {
        let pk = this.state.pk;
        if (pk === '') {
            alert("Please input your bitcoin private key");
            return;
        }
        // from private key get public address
        var privkey = new Buffer(pk, 'hex');
        let pa = ethereum.privateToAddress(privkey).toString('hex');
        console.log("ethereum public address = " + pa)
        if (pa !== null) {
            dispatch(ethLogIn(pa,pk));
            let balance = await axios(getBalanceLink(this.props.net,pa));
            dispatch(setEthBalance(parseFloat(balance.data.balance) / 100000000));

            let base,eth_blockheight;

            if (this.props.net === "MainNet") {
                base = "https://api.blockcypher.com/v1/eth/main/addrs/" + pa + "?token=" + BLOCK_TOKEN;
            } else {
                base = "https://api.blockcypher.com/v1/beth/test/addrs/" + pa + "?token=" + BLOCK_TOKEN;
            }

            let response = await axios.get(base);

            let trans = response.data.txrefs;
            if (trans !== undefined) {
                eth_blockheight =  trans[0].block_height
            } else {
                eth_blockheight = 0;
            }

            dispatch(setEthBlockHeight(eth_blockheight));

            let redirectUrl = this.props.ethLoginRedirect || "/receiveEthereum";
            let self = this;
            setTimeout(()=>{
                self.props.history.push(redirectUrl);
            }, 1000);
        } else {
            alert("Failed to login");
        }

        this.setState({
            pa: pa,
            pk: ''
        });

    }

    render() {

        const dispatch = this.props.dispatch;

        console.log(this.props.net);
        return (
            <div id="" className="">
                <div className="dash-panel">

                    <div className="col-xs-12">
                        <img
                            src={ethLogo}
                            alt=""
                            width="44"
                            className="neo-logo logobounce"
                        />
                        <h2>Create New Ethereum Address</h2>
                    </div>
                    <div className="col-xs-12 center">
                        <hr className="dash-hr-wide" />
                    </div>
                    <div className="col-xs-12">
                        <input
                            className="trans-form"
                            placeholder="Enter a Ethereum (ETH) private key to acces your funds"
                            onChange={
                                (val)=>{
                                    this.state.pk = val.target.value;
                                }
                            } />
                        <Link>
                            <div className="grey-button" onClick={()=>this.login(dispatch)} >Login</div>
                        </Link>
                    </div>
                    <div className="col-xs-12">
                        <h4 className="center">- Or -</h4>
                        <Link>
                            <div className="grey-button" onClick={this.getRandomAddress}>Generate new Ethereum (ETH) address</div>
                        </Link>
                    </div>


                    {
                        this.state.pk !== '' ? (
                            <div className="col-xs-12">
                                <h4>Private key</h4>
                                <input  className="form-control-exchange" value={this.state.pk} />
                                {/* {this.state.pk} */}
                                <br/>
                            </div>
                        ): null
                    }

                    {
                        this.state.pa !== '' ? (
                            <div className="col-xs-12">
                                <h4>Public address</h4>
                                <input className="form-control-exchange" value={this.state.pa} />
                                <br/>
                            </div>
                        ): null
                    }



                    <div className="clearboth" />

                    <div className="clearboth" />

                </div>

                <div className="col-xs-12">
                    <p className="send-notice">
                        You should store your private key off-line in a safe dry place such as a safety deposit box or fire-proof safe. Saving your private key on your computer or mobile device is not reccomended.
                    </p>

                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    blockHeight: state.metadata.blockHeight,
    net: state.metadata.network,
    address: state.account.address,
    neo: state.wallet.Neo,
    price: state.wallet.price,
    gas: state.wallet.Gas,
    wif: state.account.wif,
    ethLoggedIn: state.account.ethLoggedIn,
    ethPrivKey: state.account.ethPrivKey,
    ethPubAddr: state.account.ethPubAddr,
    ethLoginRedirect: state.account.ethLoginRedirect,
});

NewEthereum = connect (mapStateToProps)(NewEthereum);
export default NewEthereum;