import React, { Component } from "react";
import { connect } from "react-redux";
import QRCode from "qrcode.react";
import { clipboard } from "electron";
import { shell } from "electron";
import litecoinLogo from "../img/litecoin.png";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router";
import axios from 'axios';
import { setLtcBalance } from '../modules/wallet'

import { ltcLogIn, ltcLoginRedirect } from '../modules/account';

var bitcoin = require('bitcoinjs-lib');
var litecoin = bitcoin.networks.litecoin;

// var blocktrail = require('blocktrail-sdk');

var key = "5150cb37187737d3b20b02fe02585e181e79b26b";
var secret = "20a05d922df92cdca8885287cee30c623146403d";

const getBalanceLink = (net, addr) => {
    let url;

    if (net === "MainNet") {
        url = 'https://blockexplorer.com/api/addr/' + addr + '/balance';
    } else {
        url = 'https://testnet.blockexplorer.com/api/addr/' + addr + '/balance';
    }
    return url;
};

const openExplorer = srcLink => {
    shell.openExternal(srcLink);
};

class NewLitecoin extends Component {

    constructor(props){
        super(props);
        this.state={
            pa: '',
            pk: ''
        }

        if(this.props.ltcLoggedIn){
            this.props.history.push("/receiveLitecoin");
        }

    }

    getRandomAddress = async ()=>{
        let opt = this.props.net == "TestNet" ? null:{network: bitcoin.networks.litecoin} ;
        var keyPair = bitcoin.ECPair.fromWIF(this.props.wif);
        let pa = keyPair.getAddress();
        let pk = keyPair.toWIF();
        this.setState({
            pa: pa,
            pk: pk,
        });
    };

    login = async (dispatch) => {
        let pk = this.state.pk;
        if(pk == '') {
            alert("Please input your litecoin private key");
            return;
        }

        let keyPair = await bitcoin.ECPair.fromWIF(pk, this.props.net == "TestNet" ? null:litecoin.networks.litecoin);
        let pa = keyPair.getAddress();

        if(pa != null){
            dispatch(ltcLogIn(pa, pk));

            let balance = await axios.get(getBalanceLink(this.props.net, pa));
            // alert("address: " + pa + "\nbalance: " + JSON.stringify(balance.data));
            dispatch(setLtcBalance(parseFloat(balance.data) / 100000000));

            // var client = blocktrail.BlocktrailSDK({apiKey: key, apiSecret: secret, network: "BTC", testnet: this.props.net == "TestNet"});

            // client.address(pa, function(err, address) { alert(address.balance); });


            let redirectUrl = this.props.ltcLoginRedirect || "/receiveLitecoin";
            let self = this;
            setTimeout(()=>{
                self.props.history.push(redirectUrl);
            }, 1000);
        }else{
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
                <div className="dash-chart-panel">
                    <div className="">

                        <div className="col-xs-11">
                            <img
                                src={litecoinLogo}
                                alt=""
                                width="38"
                                className="neo-logo logobounce"
                            />
                            <h2>Create New Litecoin Address</h2>
                        </div>
                    </div>
                    {/* <div className="col-xs-1">
						<h4>
						<div className="glyphicon glyphicon-print com-soon" /></h4>
						</div>

						<hr className="dash-hr-wide" />
						<div className="clearboth" />

						<div className="col-xs-12 ">
						<h3 className="mnemonic">handle</h3>
						<h3 className="mnemonic">guitar</h3>
						<h3 className="mnemonic">rainbow</h3>
						<h3 className="mnemonic">nerves</h3>
						<h3 className="mnemonic">golf</h3>
						<h3 className="mnemonic">remote</h3>
						<h3 className="mnemonic">candle</h3>
						<h3 className="mnemonic">planet</h3>
						<h3 className="mnemonic">card</h3>
						<h3 className="mnemonic">fridge</h3>
						<h3 className="mnemonic">studio</h3>
						<h3 className="mnemonic">panel</h3>

						<div className="clearboth" />

							</div>
							<div className="clearboth" />
							<br />
							<hr className="dash-hr-wide" />

							<div className="col-xs-8">
							<h5>Please write down your unique 12-word mnemonic backup passphrase above. You may use it to access your Bitcoin (BTC) funds from other wallets.</h5>
							</div>
							<div className="col-xs-4 top-20">
							<Link to={"/receiveBitcoin"}><div
								className="grey-button"
							>
								<span className="glyphicon glyphicon-bitcoin marg-right-5"/>  Generate Address
							</div>
							</Link>
							</div>
						</div> */}

                    <div className="clearboth" />
                </div>

                Login with litecoin private key
                <input
                    className="trans-form"
                    placeholder="Enter a Litecoin private key"
                    onChange={
                        (val)=>{
                            this.state.pk = val.target.value;
                        }
                    } />
                <Link>
                    <div className="grey-button" onClick={()=>this.login(dispatch)} >Login</div>
                </Link>
                or generate random address
                <Link>
                    <div className="grey-button" onClick={this.getRandomAddress}>Generate random address</div>
                </Link>

                {
                    this.state.pk !== '' ? (
                        <div>
                            Private key<br/>
                            <input  style={{color: "#dddddd", backgroundColor : '#333333', width: 500, borderRadius: 6, fontSize: 16, padding: 4, margin: 4, }} value={this.state.pk} />
                            {/* {this.state.pk} */}
                            <br/><br/>
                        </div>
                    ): null
                }

                {
                    this.state.pa !== '' ? (
                        <div>
                            Public address<br/>
                            <input style={{color: "#dddddd", backgroundColor : '#333333', width: 500, borderRadius: 6, fontSize: 16, padding: 4, margin: 4, }} value={this.state.pa} />
                            <br/>
                        </div>
                    ): null
                }

                <div className="clearboth" />
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
    ltcLoggedIn: state.account.ltcLoggedIn,
    ltcPrivKey: state.account.ltcPrivKey,
    ltcPubAddr: state.account.ltcPubAddr,
    ltcLoginRedirect: state.account.ltcLoginRedirect
});

NewLitecoin = connect(mapStateToProps)(NewLitecoin);
export default NewLitecoin;
