import React, { Component } from "react";
import { connect } from "react-redux";
import QRCode from "qrcode.react";
import { clipboard } from "electron";
import { shell } from "electron";
import elastosLogo from "../img/ela.png";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router";
import axios from 'axios';
import { setElaBalance } from '../modules/wallet'
import { setElaBlockHeight } from "../modules/metadata";
import { elaLogIn, elaLoginRedirect } from '../modules/account';
import {
    sendEvent,
    clearTransactionEvent
} from "../modules/transactions";



const getBalanceLink = (net, addr) => {
    let url;

    if (net === "MainNet") {
        url = 'https://blockchain.elastos.org/api/v1/addr/' + addr + '/?noTxList=1';
    } else {
        url = 'https://blockchain.elastos.org/api/v1/addr/' + addr + '/?noTxList=1';
    }
    return url;
};

const openExplorer = srcLink => {
    shell.openExternal(srcLink);
};

class AdvancedElastos extends Component {

    constructor(props){
        super(props);
        this.state={
            pa: '',
            pk: ''
        }

        if(this.props.elaLoggedIn){
            this.props.history.push("/receiveElastos");
        }

    }


    login = async (dispatch) => {
        let pk = this.state.pk;
        if(pk == '') {
            dispatch(sendEvent(false,"Invalid Elastos private key. Please input a valid Elastos private key."));
            setTimeout(() => dispatch(clearTransactionEvent()), 3000);
            return false;
        }

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
                console.log("elastos balance res = " + JSON.stringify(res));
                dispatch(setElaBalance(parseFloat(res.data.balance)));

                let ela_blockheight = parseInt(res.data.txApperances);
                dispatch(setElaBlockHeight(ela_blockheight))


                let redirectUrl = this.props.elaLoginRedirect || "/receiveElastos";
                let self = this;
                setTimeout(()=>{
                    self.props.history.push(redirectUrl);
                }, 3000);

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
                        <h2>Create New Elastos Address</h2>
                    </div>
                    <div className="col-xs-12 center">
                        <hr className="dash-hr-wide" />
                    </div>
                    <div className="col-xs-9 top-20">
                        <input
                            className="trans-form"
                            placeholder="Enter a Elastos (ELA) private key to acces your funds"
                            onChange={
                                (val)=>{
                                    this.state.pk = val.target.value;
                                }
                            } />
                    </div>
                    <div className="col-xs-3 top-20">
                        <Link>
                            <div className="grey-button" onClick={() => this.login(dispatch)} >Login</div>
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
    elaLoggedIn: state.account.elaLoggedIn,
    elaPrivKey: state.account.elaPrivKey,
    elaPubAddr: state.account.elaPubAddr,
    elaLoginRedirect: state.account.elaLoginRedirect,
    elaAccountKeys: state.account.elaAccountKeys
});

AdvancedElastos = connect(mapStateToProps)(AdvancedElastos);
export default AdvancedElastos;
