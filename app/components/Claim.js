import React, { Component } from "react";
import { connect } from "react-redux";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";

import ReactTooltip from "react-tooltip";
import { log } from "../util/Logs";
import { StatusMessage } from "../components/App";

import {api,wallet} from "@cityofzion/neon-js"

import { doClaimAllGas, doSendAsset } from "neon-js";
import { setClaimRequest, disableClaim } from "../modules/claim";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";

import GasClaimChart from "./GasClaimChart";


// wrap claiming with notifications
//
// const doClaimNotify = (dispatch, net, selfAddress, wif) => {
//   log(net, "CLAIM", selfAddress, { info: "claim all gas" });
//   doClaimAllGas(net, wif).then(response => {
//     if (response.result === true) {
//       dispatch(
//         sendEvent(
//           true,
//           "Your GAS claim was successful! Your GAS balance will be updated once the blockchain has processed it in a couple minutes."
//         )
//       );
//       setTimeout(() => dispatch(disableClaim(false)), 3000);
//     } else {
//       dispatch(sendEvent(false, "Sorry. Claim failed. Please try again."));
//     }
//     setTimeout(() => dispatch(clearTransactionEvent()), 2000);
//   });
// };


const doClaimNotify = async (dispatch, net, selfAddress, wif) => {
    log(net, "CLAIM", selfAddress, { info: "claim all gas" });
    console.log("GAS claiming starting.....")
    const c = new wallet.Account(wif);

    const config = {
        net: net,  // The network to perform the action, MainNet or TestNet.
        address: selfAddress,
        privateKey: c.privateKey
    }
    console.log("config -------> " + JSON.stringify(config));
    await api.claimGas(config).then(response => {
        console.log("claim GAS----->" + JSON.stringify(response));
        if (response.response.result === true) {
            dispatch(
                sendEvent(
                    true,
                    "Your GAS claim was successful! Your GAS balance will be updated once the blockchain has processed it in a couple minutes."
                )
            );
            setTimeout(() => dispatch(disableClaim(false)), 3000);
        } else {
            dispatch(sendEvent(false, "Sorry. Claim failed. Please try again."));
        }
        setTimeout(() => dispatch(clearTransactionEvent()), 2000);
    }).catch(error=>{
        dispatch(sendEvent(false, "Sorry. Claim failed. Please try again."));
        setTimeout(() => dispatch(clearTransactionEvent()), 2000);
    });
};



// To initiate claim, first send zero Neo to own address, the set claimRequest state
// When new claims are available, this will trigger the claim
const doGasClaim = (dispatch, net, wif, selfAddress, ans) => {
  // if no neo in account, no need to send to self first
  if (ans === 0) {
    doClaimNotify(dispatch, net, selfAddress, wif);
  } else {
    dispatch(sendEvent(true, "Sending 0 Neo in order to claim your GAS..."));
    log(net, "SEND", selfAddress, {
      to: selfAddress,
      amount: ans,
      asset: "NEO"
    });
    doSendAsset(net, selfAddress, wif, "Neo", ans).then(response => {
      if (response.result === undefined || response.result === false) {
        dispatch(
          sendEvent(false, "Oops! Transaction failed. Please try again.")
        );
        setTimeout(() => dispatch(clearTransactionEvent()), 2000);
      } else {
        dispatch(sendEvent(true, "Waiting for the transaction to clear. You will be notified when your GAS claim is successful."));
        setTimeout(() => dispatch(clearTransactionEvent()), 3000);
        dispatch(setClaimRequest(true));
        initiateGetBalance(dispatch, net, selfAddress);
        setTimeout(() => dispatch(disableClaim(true)), 3000);
      }
    });
  }
};


class Claim extends Component {
  componentDidUpdate = () => {
    if (
      this.props.claimRequest === true &&
      this.props.claimWasUpdated == true
    ) {
      this.props.dispatch(setClaimRequest(false));
      doClaimNotify(
        this.props.dispatch,
        this.props.net,
        this.props.address,
        this.props.wif
      );
    }
  };

  render = () => {
    let renderButton;
    const doClaim = () =>
      doGasClaim(
        this.props.dispatch,
        this.props.net,
        this.props.wif,
        this.props.address,
        this.props.neo
      );
    if (this.props.disableClaimButton === false) {
      renderButton = (
        <div id="gas-button" onClick={doClaim}>
          <span className="gas-claim">
            Claim Gas<br />
            {this.props.claimAmount}
          </span>
        </div>
      );
    } else {
      renderButton = (
        <div data-tip data-for="claimTip" >
          <div id="gas-button"  className="">
            <span className="gas-claim">
              Claim Gas<br />
              {this.props.claimAmount}
            </span>

          </div>
          <div id="gas-loader" />
          <ReactTooltip
            className="solidTip"
            id="claimTip"
            place="bottom"
            type="dark"
            effect="solid"
          >
            <span>You can claim GAS once every 5 minutes</span>
          </ReactTooltip>
        </div>
      );
    }
    return <div id="claim">{renderButton}
    <GasClaimChart />
    </div>;
  };
}

const mapStateToProps = state => ({
  claimAmount: state.claim.claimAmount,
  claimRequest: state.claim.claimRequest,
  claimWasUpdated: state.claim.claimWasUpdated,
  disableClaimButton: state.claim.disableClaimButton,
  wif: state.account.wif,
  address: state.account.address,
  net: state.metadata.network,
  neo: state.wallet.Neo
});

Claim = connect(mapStateToProps)(Claim);

export default Claim;
