import React, { Component } from "react";
import { connect } from "react-redux";
import QRCode from "qrcode.react";
import { clipboard } from "electron";
import { shell } from "electron";
import litecoinLogo from "../img/litecoin.png";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router";
import axios from 'axios';
import { setLtcBalance } from '../modules/wallet';
import storage from "electron-json-storage";
import { setLtcBlockHeight } from "../modules/metadata";
import { ltcLogIn, ltcLoginRedirect,ltcCreated ,setLtcKeys } from '../modules/account';
import DisplayPrivateKeysLTC from "../components/DisplayPrivateKeysLTC";

import Search from "./Search";
import TopBar from "./TopBar";

var bitcoin = require('bitcoinjs-lib');
var litecoin = bitcoin.networks.litecoin;

// var blocktrail = require('blocktrail-sdk');

var key = "5150cb37187737d3b20b02fe02585e181e79b26b";
var secret = "20a05d922df92cdca8885287cee30c623146403d";

let wif_input;
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
    componentDidMount = () => {
        storage.get("ltckeys", (error, data) => {
            this.props.dispatch(setLtcKeys(data));
        });
    }

    constructor(props){
        super(props);
        this.state={
            pa: '',
            pk: ''
        }

        if(this.props.ltcLoggedIn){
            this.props.history.push("/sendLTC");
        }

    }

    getRandomAddress = async (dispatch)=>{
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

        dispatch(ltcCreated());

        this.props.history.push("/DisplayPrivateKeysLTC/"+ this.props.history + "/" + this.state.pa + "/" + this.state.pk);
    };

    login = async (dispatch) => {
        let pk;
        if(wif_input.value === undefined || wif_input.value === '' || wif_input.value === null) {
            pk = this.state.pk;
            if(pk == '') {
                alert("Please input your litecoin private key");
                return;
            }
        } else {
            pk = wif_input.value;
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


            let redirectUrl = this.props.ltcLoginRedirect || "/sendLTC";
            let self = this;
            setTimeout(()=>{
                self.props.history.push(redirectUrl);
            }, 100);
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

      <div className="breadBar">
      <div className="col-flat-10">
      <ol id="no-inverse" className="breadcrumb">

      <li className="active">Litecoin Login</li>
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
								src={litecoinLogo}
								alt=""
								width="44"
								className="neo-logo flipInY"
							/>
							<h2>Load Saved or Create New Litecoin Address</h2>
							</div>
							<div className="col-xs-12 center">
								<hr className="dash-hr-wide" />
							</div>
							<div className="col-xs-9">

              <select
               name="select-profession"
               id="select-profession"
               className=""
               ref={node => (wif_input = node)}
              >
                  <option selected disabled={true}>
                      Select a saved wallet
                  </option>
                  {_.map(this.props.ltcAccountKeys, (value, key) => (
                      <option key={Math.random()} value={value}>
                          {key}
                      </option>
                  ))}
              </select>

                            </div>
                          <div className="col-xs-3">
                                <Link>
                                    <div className="btn-send" onClick={()=>this.login(dispatch)} >Login</div>
                                </Link>
                          </div>

							<div className="col-xs-9 top-20">
							<h4 className="center">- Or -</h4>
							<Link>
							<div className="grey-button" onClick={()=>this.getRandomAddress(dispatch)}>Generate new Litecoin (LTC) address</div>
							</Link>
							</div>

              <div className="col-xs-3 top-70">
              <Link to="/advancedLitecoin">
              <div className="grey-button com-soon">Advanced</div>
              </Link>

              </div>

            <div className="clearboth" />

			<div className="clearboth" />

			</div>

				<div className="col-xs-12">
					<p className="send-notice">
          If you generate a new Litecoin address, you must backup/print the new Litecoin private key. Please backup all private data!
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
    ltcAccountKeys: state.account.ltcAccountKeys,
    ltcCreated: state.account.ltcCreated
});

NewLitecoin = connect(mapStateToProps)(NewLitecoin);
export default NewLitecoin;
