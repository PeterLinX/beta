import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { ledgerNanoSGetLogin } from "../modules/account";
import {wallet} from '@cityofzion/neon-js'
import Neon from '@cityofzion/neon-js'
import LedgerLogo from "./Brand/LedgerLogo";
import ReactTooltip from "react-tooltip";

const neonJsApi = require( 'neon-js' );
const comm_node = require('ledger-node-js-api');

const bip44_path =
    "8000002C"
    + "80000378"
    + "80000000"
    + "00000000"
    + "00000000";

let ledgerDeviceInfo = ""

const onLedgerLogin = (dispatch,history)=> {
    let publicKey = undefined;
    let publicKeyInfo = undefined;

    comm_node.create_async().then(function (comm) {
        var message = Buffer.from( "8004000000" + bip44_path, "hex" );
        var validStatus = [0x9000];

        comm.exchange(message.toString("hex"),validStatus).then(function (response) {
            comm.device.close();

            var publicKey = response.substring( 0, 130 );

            console.log( "Public Key [" + publicKey.length + "] " + publicKey + "\n" );

            var publicKeyEncoded = neonJsApi.getPublicKeyEncoded( publicKey );

           console.log( "Public Key Encoded [" + publicKeyEncoded.length + "]" + publicKeyEncoded + "\n" );

            var publicKeyVerified = neonJsApi.verifyPublicKeyEncoded( publicKeyEncoded );

            //let accounts = neonJsApi.getAccountsFromPublicKey( publicKeyEncoded );
            let account = Neon.create.account(publicKeyEncoded);

            publicKeyInfo = "Address " + account.address + " Verified: " + publicKeyVerified;
            console.log(publicKeyInfo)

            dispatch(ledgerNanoSGetLogin(account));
            history.push("/dashboard");

        }).catch(function (reason) {
            comm.device.close();
            console.log( "error reason " + reason + "\n" );
            publicKeyInfo = "An error occured[1]: " + reason;
            dispatch(
                sendEvent(false, publicKeyInfo + ". Please try again.")
            );
            setTimeout(() => dispatch(clearTransactionEvent()), 1000);
        })
    }).catch(function (reason) {
        comm.device.close();
        console.log( "error reason " + reason + "\n" );
        publicKeyInfo = "An error occured[2]: " + reason;

        dispatch(
            sendEvent(false, publicKeyInfo + ". Please try again.")
        );
        setTimeout(() => dispatch(clearTransactionEvent()), 1000);
    })
}

const getLedgerDeviceInfo = () => {
    console.log("getLedgerDeviceInfo \n");

    comm_node.list_async().then(function (result) {
       if (result.length == 0) {
           ledgerDeviceInfo = "Connection Failed! Please connect your device and open the NEO App.";
       } else {
           comm_node.create_async().then(function (comm) {
               let deviceInfo = comm.device.getDeviceInfo();
               comm.device.close();

               ledgerDeviceInfo = "Success! Ledger Nano S connected. Device info: " + JSON.stringify( deviceInfo );
           }).catch(function (reason) {
               comm.device.close();
               ledgerDeviceInfo = "An error occured: " + JSON.stringify( reason );
           })
       }
    });

}

class LedgerLogin extends Component {
    render = () =>{
        getLedgerDeviceInfo();
        return (
            <div className="center">
            <div className="ledgerlogo logobounce"><LedgerLogo width={140} /></div>
            <div className="login-address-bk top-130">
                <h1 className="top-50">Ledger Login</h1>
                <div className="col-xs-10 col-xs-offset-1">
                <h4>Please ensure your Ledger Nano S is unlocked and the NEO app is open on the device. Click login to continue.</h4>
                <div>
                    <button
                        className="grey-button top-20"
                        onClick={()=>onLedgerLogin(this.props.dispatch,this.props.history)}>Login using Ledger Nano S</button>

                    <div className="top-20 com-soon">{ledgerDeviceInfo}</div>
                    <div className="clearboth" />
                </div>
                <div className="clearboth" />
                </div>
                <div className="clearboth" />
            </div>

            <div className="dash-bar top-50">

              <Link to="/create">
                <div className="dash-icon-bar">
                  <div className="icon-border">
                    <div className="neo-icon" />
                  </div>
                  Create a NEO Address
                </div>
              </Link>
              <Link to="/encryptKey">
                <div className="dash-icon-bar">
                  <div className="icon-border">
                    <span className="glyphicon glyphicon-qrcode" />
                  </div>
                  Login Using Private Key
                </div>
              </Link>
              <Link to="/LoginNep2">
                <div className="dash-icon-bar">
                  <div className="icon-border">
                    <span className="glyphicon glyphicon-lock" />
                  </div>
                  Login Using Encrypted Key
                </div>
              </Link>

              <Link to="/">
                <div className="dash-icon-bar">
                  <div className="icon-border">
                    <span className="glyphicon glyphicon-user" />
                  </div>
                  Open a Saved Wallet
                </div>
              </Link>

            </div>
            <div className="login-copyright">&copy; Copyright 2018 Morpheus</div>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    blockHeight: state.metadata.blockHeight,
    wif: state.account.wif,
    address: state.account.address,
    net: state.metadata.network,
    neo: state.wallet.Neo,
    gas: state.wallet.Gas,
    selectedAsset: state.transactions.selectedAsset,
    confirmPane: state.dashboard.confirmPane,
    isHardwareLogin: state.account.isHardwareLogin,
    accounts: state.account.accounts
});

LedgerLogin = connect(mapStateToProps)(LedgerLogin);

export default LedgerLogin;
