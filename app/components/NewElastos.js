import React, { Component } from "react";
import { connect } from "react-redux";
import QRCode from "qrcode.react";
import { clipboard } from "electron";
import { shell } from "electron";
import elastosLogo from "../img/ela.png";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router";
import axios from 'axios';
import { setElaBalance } from '../modules/wallet';
import storage from "electron-json-storage";
import { setElaBlockHeight } from "../modules/metadata";
import {
    sendEvent,
    clearTransactionEvent
} from "../modules/transactions";
import { elaLogIn, elaLoginRedirect,elaCreated ,setElaKeys } from '../modules/account';
import DisplayPrivateKeysELA from "../components/DisplayPrivateKeysELA";

let wif_input;
const getBalanceLink = (net, addr) => {
    let url = 'https://blockchain.elastos.org/api/v1/addr/' + addr + '/?noTxList=1';
    return url;
};

const openExplorer = srcLink => {
    shell.openExternal(srcLink);
};

class NewElastos extends Component {
    componentDidMount = () => {
        storage.get("elakeys", (error, data) => {
            this.props.dispatch(setElaKeys(data));
        });
    }

    constructor(props){
        super(props);
        this.state={
            pa: '',
            pk: ''
        }

        if(this.props.elaLoggedIn){
            this.props.history.push("/sendELA");
        }

    }

    getRandomAddress = async (dispatch)=>{

        let res = await axios.post('http://159.89.224.63:8989/',
            {
                method:"gen_priv_pub_addr",
                id:0,
                params:[]
            });
        let result = res.data.Result;
        console.log(" ela adress result = " + JSON.stringify(result));
        let pa = result.Address;
        let pk = result.PrivateKey;

        this.setState({
            pa: pa,
            pk: pk,
        });

        dispatch(elaCreated());

        this.props.history.push("/DisplayPrivateKeysELA/"+ this.props.history + "/" + this.state.pa + "/" + this.state.pk);
    };

    login = async (dispatch) => {
        let pk;
        if(wif_input.value === undefined || wif_input.value === '' || wif_input.value === null) {
            pk = this.state.pk;
            if(pk == '') {
                alert("Please input your elastos private key");
                return;
            }
        } else {
            pk = wif_input.value;
        }

        console.log("elastos pk = " + pk);
        let res = await axios.post('http://159.89.224.63:8989/',
            {
                method:"genAddress",
                id:0,
                params:[
                    {
                        PrivateKey:pk
                    }
                    ]
            });

        let pa = res.data.Result;
        console.log("elastos pa = " + pa);

        if (pa !== undefined) {
            if(pa !== null){
                dispatch(elaLogIn(pa, pk));

                let res = await axios.get(getBalanceLink(this.props.net, pa));
                dispatch(setElaBalance(parseFloat(res.data.balance)));

                let ela_blockheight = 0;
                dispatch(setElaBlockHeight(ela_blockheight))


                let redirectUrl = this.props.elaLoginRedirect || "/sendELA";
                let self = this;
                setTimeout(()=>{
                    self.props.history.push(redirectUrl);
                }, 100);

                this.setState({
                    pa: pa,
                    pk: ''
                });
            }else{
                alert("Failed to login");
                dispatch(
                    sendEvent(
                        false,
                        "Sorry, Login faied."
                    )
                );
                setTimeout(() => dispatch(clearTransactionEvent()), 2000);
                return false;
            }
        } else {
            dispatch(
                sendEvent(
                    false,
                    "Sorry, Login faied."
                )
            );
            setTimeout(() => dispatch(clearTransactionEvent()), 2000);
            return false;
        }
    }

    render() {

        const dispatch = this.props.dispatch;

        console.log(this.props.net);
        return (
            <div id="" className="">
                <div className="dash-panel">

                    <div className="col-xs-12">
                        <img
                            src={elastosLogo}
                            alt=""
                            width="44"
                            className="neo-logo logobounce"
                        />
                        <h2>Load Saved or Create New Elastos Address</h2>
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
                            {_.map(this.props.elaAccountKeys, (value, key) => (
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
                            <div className="grey-button" onClick={()=>this.getRandomAddress(dispatch)}>Generate new Elastos (ELA) address</div>
                        </Link>
                    </div>

                    <div className="col-xs-3 top-70">
                        <Link to="/advancedElastos">
                            <div className="grey-button com-soon">Advanced</div>
                        </Link>

                    </div>

                    <div className="clearboth" />

                    <div className="clearboth" />

                </div>

                <div className="col-xs-12">
                    <p className="send-notice">
                        If you generate a new Elastos address, you must backup/print the new Elastos private key. Please backup all private data!
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
    elaLoggedIn: state.account.elaLoggedIn,
    elaPrivKey: state.account.elaPrivKey,
    elaPubAddr: state.account.elaPubAddr,
    elaLoginRedirect: state.account.elaLoginRedirect,
    elaAccountKeys: state.account.elaAccountKeys,
    elaCreated: state.account.elaCreated
});

NewElastos = connect(mapStateToProps)(NewElastos);
export default NewElastos;
