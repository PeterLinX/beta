import React, { Component } from "react";
import { connect } from "react-redux";
import Modal from "react-modal";
import axios from "axios";
import {ASSET_LIST} from "../core/constants";
import TopBar from "./TopBar";

import {
    sendEvent,
    clearTransactionEvent
} from "../modules/transactions";
const baseUrl = process.env.SHAPESHIFT_API === "mock"
    ? "https://3e84236c-9ef9-47dc-ba46-c51fdd34411a.mock.pstmn.io"
    : "https://shapeshift.io";
const shapeshiftPk = "5aad9888213a9635ecda3ed8bb2dc45c0a8d95dc36da7533c78f3eba8f765ce77538aae79d0e35642e39f208b7428631188f03c930e91f299f9eb40556f8e74d";

let withdrawalAsset = {}, depositAsset = {};
let withdrawalAmount, depositAmount, confirmButton;

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.75)"
    },
    content: {
        margin: "100px auto 0",
        padding: "30px 30px 30px 30px",
        border: "4px solid #222",
        background: "rgba(12, 12, 14, 1)",
        borderRadius: "20px",
        top: "100px",
        height: 260,
        width: 600,
        left: "100px",
        right: "100px",
        bottom: "100px",
        boxShadow: "0px 10px 44px rgba(0, 0, 0, 0.45)"
    }
};

const validateBalance = (asset,withdrawal,btc,ltc,eth,neo) => {
    switch (asset) {
        case "btc":
            if (btc === 0) {
                return 0;
            } else if(btc < withdrawal) {
                return 1;
            } else {
                return 2;
            }
            break;
        case "ltc":
            if(ltc === 0) {
                return 0;
            } else if (ltc < withdrawal) {
                return 1;
            } else {
                return 2;
            }
            break;
        case "eth":
            if(eth === 0) {
                return 0;
            } else  if(eth < withdrawal) {
                return 1;
            } else {
                return 2;
            }
            break;
        case "neo":
            if (neo === 0) {
                return 0;
            } else if(neo < withdrawal) {
                return 1;
            } else {
                return 2;
            }
    }
}

const getAddressFromAsset = (asset,btcaddr,ltcaddr,ethaddr,neoaddr) => {
    switch (asset) {
        case "btc":
            if (btcaddr !== null) {
                return btcaddr;
            } else {
                return null;
            }
            break;
        case "ltc":
            if (ltcaddr !== null) {
                return ltcaddr;
            } else {
                return null;
            }
            break;
        case "eth":
            if (ethaddr !== null) {
                return ethaddr;
            } else {
                return null;
            }
            break;
        case "neo":
            return neoaddr;
        default:
            return null;
            break;
    }
}

const exchangeFunc = async (
    dispatch,
    btcaddr,
    ltcaddr,
    ethaddr,
    neoaddr,
    btc,
    ltc,
    eth,
    neo
) => {
    dispatch(sendEvent(true, "Processing..."));
    //Implement exchange function
    //withdrawal coin(input coin)
    let withdrawal_asset = withdrawalAsset.value.toLowerCase();
    //deposite coin(output coin)
    let deposit_asset = depositAsset.value.toLowerCase();
    let withdrawal_amount = parseFloat(withdrawalAmount.value);
    let deposite_amount = parseFloat(depositAmount.value);
    let withdrawalAddress = getAddressFromAsset(withdrawal_asset,btcaddr,ltcaddr,ethaddr,neoaddr);
    let validate_value = validateBalance(withdrawal_asset,withdrawal_amount,btc,ltc,eth,neo);

    if (validate_value === 0){
        dispatch(sendEvent(false, "Your balanace for "+withdrawal_asset+" is 0."));
        setTimeout(() => dispatch(clearTransactionEvent()), 2000);
        return false;
    } else if (validate_value === 1) {
        dispatch(sendEvent(false, "Your balanace for "+withdrawal_asset+" is less than transaction amount."));
        setTimeout(() => dispatch(clearTransactionEvent()), 2000);
        return false;
    } else {
        if (withdrawalAddress === null) {
            dispatch(sendEvent(false, "Addrss for "+ withdrawal_asset +"is empty."));
            setTimeout(() => dispatch(clearTransactionEvent()), 2000);
            return false;
        } else {
            console.log("withdrawalAddress = " + withdrawalAddress);
            let depositAddress = getAddressFromAsset(deposit_asset,btcaddr,ltcaddr,ethaddr,neoaddr);

            if (depositAddress === null) {
                dispatch(sendEvent(false, "Addrss for "+ deposit_asset +"is empty."));
                setTimeout(() => dispatch(clearTransactionEvent()), 2000);
                return false;
            } else {
                console.log("depositeAddress = " + depositAddress);

                let url = `${baseUrl}/sendamount`;
                const shiftConfig = {
                    withdrawal: withdrawalAddress,
                    pair: `${deposit_asset}_${withdrawal_asset}`,
                    amount: withdrawal_amount,
                    depositAmount: deposite_amount,
                    returnAddress: depositAddress
                }

                shiftConfig.apiKey = shapeshiftPk;

                const response = await axios.post(url,shiftConfig);
                const txData = response.data;

                if (txData.error) {
                    dispatch(sendEvent(false, "Exchange has failed."));
                    setTimeout(() => dispatch(clearTransactionEvent()), 2000);
                    return false;
                } else {
                    dispatch(sendEvent(true, "Exchange Complete! Your balance will automatically update when the blockchain has processed it."));
                    setTimeout(() => dispatch(clearTransactionEvent()), 5000);
                    return true;
                }
            }
        }
    }

}



const StatusMessage = ({ withdrawalCoin, depositCoin, withdrawal, deposit, handleCancel, handleConfirm}) => {
    let message = (
            <Modal
                isOpen={true}
                closeTimeoutMS={5}
                style={styles}
                contentLabel="Modal"
                ariaHideApp={false}
            >
                <div>
                    <div className="center modal-alert">
                    </div>
                    <div className="center modal-alert top-20">
                        <strong>Confirm buying {deposit} {depositCoin} using {withdrawal} {withdrawalCoin}</strong>
                    </div>
                    <div className="row top-30">
                        <div className="col-xs-6">
                            <button className="cancel-button" onClick={handleCancel}>Cancel</button>
                        </div>
                        <div className="col-xs-6">
                            <button className="btn-send" onClick={handleConfirm}>Confirm</button>
                        </div>
                    </div>
                </div>
            </Modal>
        );

    return message;
};



class ExchangeAsset extends Component {
    constructor(props) {
        super(props);
        this.state = {
            withdrawal_amount: 0,
            deposit_amount: 0,
            value: 0,
            modalStatus: false,
            rate: 0
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeRating = this.handleChangeRating.bind(this);

    }

    componentDidMount = () => {

       };

    async handleChange(event) {
        this.setState({ value: event.target.value });
        let withdrawal_asset = withdrawalAsset.value.toLowerCase();
        let deposit_asset = depositAsset.value.toLowerCase();
        let pair = `${withdrawal_asset}_${deposit_asset}`;
        let url = `${baseUrl}/rate/${pair}`;
        console.log("url = " + withdrawal_asset + deposit_asset)
        const response = await axios.get(url);
        let rate = parseFloat(response.data.rate);
        const value = parseFloat(this.state.value) * rate;
        this.setState({ deposit_amount: value });
    }

    async handleChangeRating(event) {

    }



    render = () => {
        const {
            dispatch,
            confirmPane,
            btcPubAddr,
            ltcPubAddr,
            ethPubAddr,
            address,
            btc,
            ltc,
            eth,
            neo
        } = this.props;

        let convertFunction = this.handleChange;
        let amount = this.state.deposit_amount;
       return (
         <div>
         <TopBar />


           <div className="dash-panel">
               {
                   this.state.modalStatus?
                       <StatusMessage
                           withdrawalCoin={withdrawalAsset.value}
                           depositCoin={depositAsset.value}
                           withdrawal={withdrawalAmount.value}
                           deposit={depositAmount.value}
                           handleCancel = {
                               () => {
                                   this.setState({
                                       modalStatus: false
                                   })
                               }
                           }
                           handleConfirm ={() => {
                               exchangeFunc(
                                   dispatch,
                                   btcPubAddr,
                                   ltcPubAddr,
                                   ethPubAddr,
                                   address,
                                   btc,
                                   ltc,
                                   eth,
                                   neo
                               )
                               this.setState({
                                   modalStatus: false
                               })
                           }}
                       />
                       :
                       null
               }

               <div className="row">
                   <div id="buy" className="col-xs-6">

                           <p>Select Asset to withdrawal</p>
                           <select
                               name="select-profession-withdrawal"
                               id="select-profession"
                               className=""
                               onChange={this.change}
                               ref={node => (withdrawalAsset = node)}
                           >
                               <option selected disabled={true} value={''}>
                                   Select a asset to withdrawal
                               </option>
                               {ASSET_LIST.map((item, key) => (
                                   <option key={Math.random()} value={item.shortname} selected={withdrawalAsset.value==item.shortname}>
                                       {item.fullname}
                                   </option>
                               ))}

                           </select>

                           <p>Enter amount to exchange</p>
                           <input
                               className="form-send-btc"
                               id="withdrawalAmount"
                               onChange={convertFunction}
                               value={this.state.value}
                               placeholder="Enter amount to withdrawal"
                               ref={node => {
                                   withdrawalAmount = node;
                               }}
                           />

                    </div>

                       <div className="col-xs-6">

                       <p>Select Asset to deposit</p>
                       <select
                           name="select-profession-deposit"
                           id="select-profession"
                           className=""
                           onChange={this.change}
                           ref={node => (depositAsset = node)}
                       >
                           <option selected disabled={true} value={''}>
                               Select a asset to deposit
                           </option>

                           {ASSET_LIST.map((item, key) => (
                               <option key={Math.random()} value={item.shortname} selected={depositAsset.value==item.shortname} >
                                   {item.fullname}
                               </option>
                           ))}

                       </select>

                           <p> Amount to Receive</p>
                           <input
                               className="form-send-btc"
                               id="depositAmount"
                               onChange={this.handleChangeRating}
                               placeholder="Enter amount to deposit"
                               value={`${amount}`}
                               ref={node => {
                                   depositAmount = node;
                               }}
                           />

                       </div>

                       <div className="col-xs-4 top-20">
                           <button
                               className="grey-button"
                               onClick={() => {
                                   if (withdrawalAsset.value === '') {
                                       dispatch(sendEvent(false, "You can not exchange without asset to buy."));
                                       setTimeout(() => dispatch(clearTransactionEvent()), 1000);
                                       return false;
                                   }

                                   if (depositAsset.value === '') {
                                       dispatch(sendEvent(false, "You can not exchange without asset in buy."));
                                       setTimeout(() => dispatch(clearTransactionEvent()), 1000);
                                       return false;
                                   }

                                   if (withdrawalAmount.value === '') {
                                       dispatch(sendEvent(false, "You can not exchange without buy price."));
                                       setTimeout(() => dispatch(clearTransactionEvent()), 1000);
                                       return false;
                                   }

                                   if (depositAmount.value === '') {
                                       dispatch(sendEvent(false, "You can not exchange without buy amount."));
                                       setTimeout(() => dispatch(clearTransactionEvent()), 1000);
                                       return false;
                                   }

                                   this.setState({
                                       modalStatus: true
                                   })
                               }}
                               ref={node => {
                                   confirmButton = node;
                               }}
                           >
                               <span className="marg-right-5"/>  Exchange
                           </button>
                   </div>
               </div>
           </div>
      </div>
       );
    };
}


const mapStateToProps = state => ({
    confirmPane: state.dashboard.confirmPane,
    address: state.account.address,
    wif: state.account.wif,
    btcLoggedIn: state.account.btcLoggedIn,
    btcPrivKey: state.account.btcPrivKey,
    btcPubAddr: state.account.btcPubAddr,
    ltcLoggedIn: state.account.ltcLoggedIn,
    ltcPrivKey: state.account.ltcPrivKey,
    ltcPubAddr: state.account.ltcPubAddr,
    ethLoggedIn: state.account.ethLoggedIn,
    ethPrivKey: state.account.ethPrivKey,
    ethPubAddr: state.account.ethPubAddr,
    elaLoggedIn: state.account.elaLoggedIn,
    elaPrivKey: state.account.elaPrivKey,
    elaPubAddr: state.account.ethPubAddr,
    btc: state.wallet.Btc,
    eth: state.wallet.Eth,
    ela: state.wallet.Ela,
    ltc: state.wallet.Ltc,
    neo: state.wallet.Neo
});

ExchangeAsset = connect(mapStateToProps)(ExchangeAsset);

export default ExchangeAsset;
