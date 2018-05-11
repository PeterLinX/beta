import React, { Component } from "react";
import { connect } from "react-redux";
import QRCode from "qrcode.react";
import { clipboard } from "electron";
import { shell } from "electron";
import ethLogo from "../img/eth.png";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router";
import storage from "electron-json-storage";
import axios from 'axios';
import { setEthBalance } from "../modules/wallet";
import {
    sendEvent,
    clearTransactionEvent,
    toggleAsset
} from "../modules/transactions";
import { ethLogIn, ethLoginRedirect,setEthKeys,ethCreated } from '../modules/account';
import { getWIFFromPrivateKey } from "neon-js";
import { encrypt_wif, decrypt_wif } from "neon-js";
import { getAccountsFromWIFKey } from "neon-js";
import { setEthBlockHeight } from "../modules/metadata";
import { BLOCK_TOKEN } from "../core/constants";

import Search from "./Search";
import TopBar from "./TopBar";

var bitcoin = require('bitcoinjs-lib');
var buffer = require("buffer");
var ethereum = require("ethereumjs-util");
var key = "c6294d6b9e829b485a6dc5842a44e2de5f8e5c57";
var secret = "073a794fbd48c76ccdde0f9d8fa12c19de554487";

let priv_input;

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
    componentDidMount = () => {
        storage.get("ethkeys", (error, data) => {
            this.props.dispatch(setEthKeys(data));
        });
    }
    constructor(props){
        super(props);
        this.state={
            pa: '',
            pk: ''
        }

        if(this.props.ethLoggedIn){
            this.props.history.push("/sendETH");
        }

    }

    getRandomAddress = async (dispatch)=>{
        let base,pa,pk;
        console.log("Starting Ethereum Wallet\n");
        if (this.props.net === "MainNet") {
            base = "https://api.blockcypher.com/v1/eth/main/addrs?token=" + BLOCK_TOKEN;
        } else {
            base = "https://api.blockcypher.com/v1/beth/test/addrs?token=" + BLOCK_TOKEN;
        }
        console.log("base request url = " + base);
        let response = await axios.post(base);
        console.log(JSON.stringify(response));
        pa = response.data.address;
        console.log("ethereum address")
        pk = response.data.private;
        this.setState({
            pa: pa,
            pk: pk,
        });
        dispatch(ethCreated());

        this.props.history.push("/DisplayPrivateKeysETH/"+ this.props.history + "/" + this.state.pa + "/" + this.state.pk);
    };

    login = async (dispatch) => {
        let pk;
        if (priv_input.value === undefined || priv_input.value === '' || priv_input.value === null) {
            pk = this.state.pk;
            if (pk === '') {
                alert("Please input your bitcoin private key");
                return;
            }
        } else {
            pk = priv_input.value;
        }

        // from private key get public address
        var privkey = new buffer.Buffer(pk, 'hex');
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

            let redirectUrl = this.props.ethLoginRedirect || "/sendETH";
            let self = this;
            setTimeout(()=>{
                self.props.history.push(redirectUrl);
            }, 100);
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

            <div className="breadBar">
            <div className="col-flat-10">
            <ol id="no-inverse" className="breadcrumb">

            <li className="active">Ethereum Login</li>
            </ol>
            </div>

            <div className="col-flat-2">
            <Search />
            </div>
            </div>

            <TopBar />

                <div className="dash-panel">

                    <div className="col-xs-12">
                        <img
                            src={ethLogo}
                            alt=""
                            width="32"
                            className="neo-logo flipInY"
                        />
                        <h2>Login or Create New Ethereum Address</h2>
                    </div>
                    <div className="col-xs-12 center">
      								<hr className="dash-hr-wide" />
      							</div>
                    <div className="col-xs-9">


                    <select
                        name="select-profession"
                        id="select-profession"
                        className=""
                        ref={node => (priv_input = node)}
                    >
                        <option selected disabled={true}>
                            Select a saved wallet
                        </option>
                        {_.map(this.props.ethAccountKeys, (value, key) => (
                            <option key={Math.random()} value={value}>
                                {key}
                            </option>
                        ))}

                    </select>


                    </div>

                    <div className="col-xs-3">
                    <Link>
                        <div className="grey-button" onClick={()=>this.login(dispatch)} >Login</div>
                    </Link>
                    </div>

                    <div className="col-xs-9 top-20">
      							<h4 className="center">- Or -</h4>
                        <Link>
                            <div className="grey-button" onClick={ ()=>this.getRandomAddress(dispatch)}>Generate new Ethereum (ETH) address</div>
                        </Link>
                    </div>

                    <div className="col-xs-3 top-70">
                    <Link to="/advancedEthereum">
                    <div className="grey-button com-soon">Advanced</div>
                    </Link>

                    </div>

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
    ethAccountKeys: state.account.ethAccountKeys,
    ethCreated: state.account.ethCreated
});

NewEthereum = connect (mapStateToProps)(NewEthereum);
export default NewEthereum;
