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
import { setLtcBlockHeight } from "../modules/metadata";
import { ltcLogIn, ltcLoginRedirect } from '../modules/account';

var bitcoin = require('bitcoinjs-lib');
var litecoin = bitcoin.networks.litecoin;

// var blocktrail = require('blocktrail-sdk');

var key = "5150cb37187737d3b20b02fe02585e181e79b26b";
var secret = "20a05d922df92cdca8885287cee30c623146403d";

const getBalanceLink = (net, addr) => {
    let url;

    if (net === "MainNet") {
        url = 'https://api.blockcypher.com/v1/ltc/main/addrs/'+addr+'/balance';
    } else {
        url = 'https://api.blockcypher.com/v1/ltc/test3/addrs/'+addr+'/balance';
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
        // let opt = this.props.net == "TestNet" ? {network:bitcoin.networks.testnet}:{network: bitcoin.networks.litecoin} ;
        // var keyPair = await bitcoin.ECPair.makeRandom(opt);
        // let pubKey = keyPair.getPublicKeyBuffer();
        // var scriptPubKey = bitcoin.script.witnessPubKeyHash.output.encode(bitcoin.crypto.hash160(pubKey));
        // let pa = keyPair.getAddress();
        // let pk = keyPair.toWIF();
        let res = await axios.post('https://api.blockcypher.com/v1/ltc/main/addrs');
        let priKey = res.data.private;
        let pubKey = res.data.public;
        let pa = res.data.address;
        let pk = res.data.wif;

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

        let keyPair = await bitcoin.ECPair.fromWIF(pk, this.props.net == "TestNet" ? {network:bitcoin.networks.testnet}:bitcoin.networks.litecoin);
        let pa = keyPair.getAddress();

        if(pa != null){
            dispatch(ltcLogIn(pa, pk));

            let res = await axios.get(getBalanceLink(this.props.net, pa));
            dispatch(setLtcBalance(parseFloat(res.data.balance) / 100000000));
            // alert("address: " + pa + "\nbalance: " + JSON.stringify(balance.data));
            let base,ltc_blockheight;
            if(this.props.net == "MainNet") {
                base = "http://api.blockcypher.com/v1/ltc/main/addrs/"+pa;
            }	else {
                base = "http://api.blockcypher.com/v1/ltc/test3/addrs/"+pa;
            }

            let response = await axios.get(base);
            let trans = response.data.txrefs;
            if (trans !== undefined) {
                ltc_blockheight =  trans[0].block_height
            } else {
                ltc_blockheight = 0;
            }

            dispatch(setLtcBlockHeight(ltc_blockheight))
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
				<div className="dash-panel">

						<div className="col-xs-12">
							<img
								src={litecoinLogo}
								alt=""
								width="44"
								className="neo-logo logobounce"
							/>
							<h2>Create New Litecoin Address</h2>
							</div>
							<div className="col-xs-12 center">
								<hr className="dash-hr-wide" />
							</div>
							<div className="col-xs-12">
							<input
								className="trans-form"
								placeholder="Enter a Litecoin (LTC) private key to acces your funds"
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
							<div className="grey-button" onClick={this.getRandomAddress}>Generate new Litecoin (LTC) address</div>
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
    ltcLoggedIn: state.account.ltcLoggedIn,
    ltcPrivKey: state.account.ltcPrivKey,
    ltcPubAddr: state.account.ltcPubAddr,
    ltcLoginRedirect: state.account.ltcLoginRedirect,
});

NewLitecoin = connect(mapStateToProps)(NewLitecoin);
export default NewLitecoin;
