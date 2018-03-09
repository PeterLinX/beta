import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router";
import { doSendAsset, verifyAddress } from "neon-js";
import Neon, { wallet, api, addContract } from "@cityofzion/neon-js";
import Modal from "react-bootstrap-modal";
import QRCode from "qrcode.react";
import { clipboard } from "electron";
import axios from "axios";
import SplitPane from "react-split-pane";
import numeral from "numeral";
import ReactTooltip from "react-tooltip";
import CryptoJS from "crypto-js";

import { log } from "../util/Logs";

import Dashlogo from "../components/Brand/Dashlogo";
import { togglePane } from "../modules/dashboard";
import {
  sendEvent,
  clearTransactionEvent,
  toggleAsset
} from "../modules/transactions";
import { setCombinedBalance } from "../modules/wallet";
import { setAddress, setPublicKey } from "../modules/account";
import { initiateGetBalance } from "./NetworkSwitch";


import commNode from "../modules/ledger/ledger-comm-node";
import ClaimLedgerGas from "./ClaimLedgerGas.js";
// to be removed
const neonJsApi = require("../modules/ledger/ledgerNeon");

const BIP44_PATH =
  "8000002C" + "80000378" + "80000000" + "00000000" + "00000000";

// hard-code asset ids for NEO and GAS
var neoId = "c56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b";
var gasId = "602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7";

var ledgerDeviceInfo = undefined;

var publicKeyInfo = undefined;

var publicKey = undefined;

var accounts = undefined;

var signature = undefined;

var signatureInfo = undefined;

var balance = undefined;

var balanceInfo = undefined;

var encodeTransactionResponse = undefined;

var signedTransaction = undefined;

var sentTransaction = undefined;

var sentTransactionInfo = undefined;

var bip44Path = undefined;

let sendAddress, sendAmount, confirmButton;

let net;

var encodeTransaction = function(
  publicKeyEncoded,
  asset,
  fromAccount2,
  ledgerBalanceNeo,
  ledgerBalanceGas
) {
  encodeTransactionResponse = undefined;

  var toAddress = sendAddress.value;
  var amount = sendAmount.value;

  var assetId;

  if (asset === "Neo") {
    assetId = neonJsApi.neoId;
  } else {
    assetId = neonJsApi.gasId;
  }

  const coinsData = {
    assetid: assetId,
    list: balance.unspent[asset],
    balance: balance[asset],
    name: asset
  };

  const fromAccount = accounts[0];

  process.stdout.write(
    "encodeTransaction coinsData " + JSON.stringify(coinsData) + "\n"
  );
  process.stdout.write(
    "encodeTransaction fromAccount " + JSON.stringify(fromAccount) + "\n"
  );
  process.stdout.write("encodeTransaction toAddress " + toAddress + "\n");
  process.stdout.write("encodeTransaction amount " + amount + "\n");

  encodeTransactionResponse = neonJsApi.transferTransaction(
    coinsData,
    publicKeyEncoded,
    toAddress,
    amount
  );

  process.stdout.write(
    "encodeTransaction encodeTransactionResponse " +
      encodeTransactionResponse +
      "\n"
  );
};

var signTransaction = function(publickeyEncoded) {
  const fromAccount = accounts[0];
  signedTransaction = neonJsApi.addContract(
    encodeTransactionResponse,
    signature,
    publickeyEncoded
  );
};

var sendTransaction = function(net) {
  sentTransaction = undefined;
  sentTransactionInfo = undefined;
  process.stdout.write("sendrawtransaction " + signedTransaction + "\n");
  neonJsApi
    .queryRPC(net, "sendrawtransaction", [signedTransaction], 4)
    .then(response => {
      sentTransaction = response;
      sentTransactionInfo = JSON.stringify(sentTransaction);
      process.stdout.write("sentTransaction " + sentTransactionInfo + "\n");
    });
};

var getBalance = function() {
  balance = undefined;
  balanceInfo = undefined;
  process.stdout.write("net " + net + "\n");
  var address = accounts[0].address;
  process.stdout.write("address " + address + "\n");
  neonJsApi.getBalance(net, address).then(response => {
    balance = response;
    balanceInfo = JSON.stringify(balance);
    process.stdout.write("balance " + balanceInfo + "\n");
    setAllLedgerInfoTimer();
  });
};

var getLedgerDeviceInfo = function() {
  process.stdout.write("getLedgerDeviceInfo \n");
  commNode.list_async().then(function(result) {
    if (result.length == 0) {
      process.stdout.write('getLedgerDeviceInfo "No device found"\n');
      ledgerDeviceInfo = "Failure : No device found";
    } else {
      commNode
        .create_async()
        .then(function(comm) {
          var deviceInfo = comm.device.getDeviceInfo();
          comm.device.close();
          ledgerDeviceInfo = "Success: " + JSON.stringify(deviceInfo);
          setAllLedgerInfoTimer();
        })
        .catch(function(reason) {
          comm.device.close();
          ledgerDeviceInfo = "An error occured: " + JSON.stringify(reason);
          setAllLedgerInfoTimer();
        });
    }
  });
};

const signatureData = function(data, privateKey) {
  var msg = CryptoJS.enc.Hex.parse(data);
  var msgHash = CryptoJS.SHA256(msg);
  const msgHashHex = new Buffer(msgHash.toString(), "hex");
  const privateKeyHex = new Buffer(privateKey, "hex");
  var elliptic = new ec("p256");
  const sig = elliptic.sign(msgHashHex, privateKey, null);
  const signature = {
    signature: Buffer.concat([
      sig.r.toArrayLike(Buffer, "be", 32),
      sig.s.toArrayLike(Buffer, "be", 32)
    ])
  };

  process.stdout.write("NEON-JS data : " + data + "\n");
  process.stdout.write("NEON-JS msg : " + msg + "\n");
  process.stdout.write("NEON-JS msgHash : " + msgHash + "\n");
  process.stdout.write("NEON-JS sig.r : " + sig.r.toString(16) + "\n");
  process.stdout.write("NEON-JS sig.s : " + sig.s.toString(16) + "\n");

  return signature.signature.toString("hex");
};

var ab2hexstring = function(arr) {
  var result = "";
  for (var i = 0; i < arr.length; i++) {
    var str = arr[i].toString(16);
    str = str.length == 0 ? "00" : str.length == 1 ? "0" + str : str;
    result += str;
  }
  return result;
};

var hexstring2ab = function(str) {
  var result = [];
  while (str.length >= 2) {
    result.push(parseInt(str.substring(0, 2), 16));
    str = str.substring(2, str.length);
  }
  return result;
};

var hexstring2uint32 = function(hex) {
  // process.stdout.write( "hexstring2int32 hex [" + hex.length + "] " + hex + "\n" );
  var reversedHex = reverseHex(hex);
  process.stdout.write(
    "hexstring2int32 reverseHex [" +
      reversedHex.length +
      "] " +
      reversedHex +
      "\n"
  );
  var ba = Buffer.from(reversedHex, "hex");
  // process.stdout.write( "hexstring2int32 ba [" + ba.length + "] " + ba + "\n" );
  var uint32_ = ba.readUInt32BE();
  process.stdout.write("hexstring2int32 uint32 " + uint32_ + "\n");
  return uint32_;
};

var getPublicKeyInfo = function() {
  publicKey = undefined;
  publicKeyInfo = undefined;
  commNode
    .create_async()
    .then(function(comm) {
      var message = Buffer.from("8004000000" + BIP44_PATH, "hex");
      var validStatus = [0x9000];
      comm
        .exchange(message.toString("hex"), validStatus)
        .then(function(response) {
          comm.device.close();

          // process.stdout.write( "Public Key Response [" + response.length + "] " + response + "\n" );

          var publicKey = response.substring(0, 130);

          process.stdout.write(
            "Public Key [" + publicKey.length + "] " + publicKey + "\n"
          );

          var publicKeyEncoded = neonJsApi.getPublicKeyEncoded(publicKey);

          process.stdout.write(
            "Public Key Encoded [" +
              publicKeyEncoded.length +
              "]" +
              publicKeyEncoded +
              "\n"
          );

          var publicKeyVerified = neonJsApi.verifyPublicKeyEncoded(
            publicKeyEncoded
          );

          //            process.stdout.write( "Public Key Verified " + publicKeyVerified + "\n" );

          //process.stdout.write( "neonJsApi.getAccountsFromPublicKey" + neonJsApi.getAccountsFromPublicKey + "\n" );

          accounts = neonJsApi.getAccountsFromPublicKey(publicKeyEncoded);

          //            process.stdout.write( "Accounts " + JSON.stringify( accounts ) + "\n" );

          publicKeyInfo =
            "Address " +
            accounts[0].address +
            " Verified: " +
            publicKeyVerified;

          setAllLedgerInfoTimer();
        })
        .catch(function(reason) {
          comm.device.close();
          process.stdout.write("error reason " + reason + "\n");
          publicKeyInfo = "An error occured[1]: " + reason;

          setAllLedgerInfoTimer();
        });
    })
    .catch(function(reason) {
      comm.device.close();
      process.stdout.write("error reason " + reason + "\n");
      publicKeyInfo = "An error occured[2]: " + reason;

      setAllLedgerInfoTimer();
    });
};

var allLedgerInfoPollIx = 0;

var setAllLedgerInfoTimer = function() {
  setImmediate(getAllLedgerInfo);
};

var getAllLedgerInfo = function(net) {
  process.stdout.write("getAllLedgerInfo " + allLedgerInfoPollIx + "\n");
  var resetPollIndex = false;
  switch (allLedgerInfoPollIx) {
    case 0:
      getLedgerDeviceInfo();
      break;
    case 1:
      getPublicKeyInfo();
      break;
    case 2:
      getBalance(net);
      break;
    default:
      allLedgerInfoPollIx = 0;
      resetPollIndex = true;
  }
  if (resetPollIndex) {
    // periodically check for a new device, disabled for now to not spam the logs.
    // setTimeout(getAllLedgerInfo, 10000);
  } else {
    allLedgerInfoPollIx++;
  }
};

setAllLedgerInfoTimer();

var reverseArray = function(arr) {
  var result = new Uint8Array(arr.length);
  for (var i = 0; i < arr.length; i++) {
    result[i] = arr[arr.length - 1 - i];
  }

  return result;
};

var reverseHex = function(hexIn) {
  var array = hexstring2ab(hexIn);
  var reversedArray = reverseArray(array);
  // add a zero at the end like in ECDsa.cs GenerateSignature
  reversedArray[reversedArray.length] = 0;
  var hexOut = ab2hexstring(reversedArray);
  return hexOut;
};

var createSignature = function(dispatch) {
  var text = encodeTransactionResponse;
  var textToSign = text + BIP44_PATH;

  signature = undefined;
  signatureInfo =
    "Ledger Signing Text of Length [" +
    textToSign.length +
    "], Please Confirm Using the Device's Buttons. " +
    textToSign;

  process.stdout.write(signatureInfo + "\n");

  var validStatus = [0x9000];

  var messages = [];

  let bufferSize = 255 * 2;
  let offset = 0;
  while (offset < textToSign.length) {
    let chunk;
    let p1;
    if (textToSign.length - offset > bufferSize) {
      chunk = textToSign.substring(offset, offset + bufferSize);
    } else {
      chunk = textToSign.substring(offset);
    }
    if (offset + chunk.length == textToSign.length) {
      p1 = "80";
    } else {
      p1 = "00";
    }

    let chunkLength = chunk.length / 2;

    process.stdout.write("Ledger Signature chunkLength " + chunkLength + "\n");

    let chunkLengthHex = chunkLength.toString(16);
    while (chunkLengthHex.length < 2) {
      chunkLengthHex = "0" + chunkLengthHex;
    }

    process.stdout.write(
      "Ledger Signature chunkLength hex " + chunkLengthHex + "\n"
    );

    messages.push("8002" + p1 + "00" + chunkLengthHex + chunk);
    offset += chunk.length;
  }

  commNode
    .create_async(0, false)
    .then(function(comm) {
      for (let ix = 0; ix < messages.length; ix++) {
        let message = messages[ix];
        process.stdout.write(
          "Ledger Message (" +
            ix +
            "/" +
            messages.length +
            ") " +
            message +
            "\n"
        );

        comm
          .exchange(message, validStatus)
          .then(function(response) {
            process.stdout.write(
              "Ledger Signature Response " + response + "\n"
            );

            if (response != "9000") {
              comm.device.close();

              /**
               * https://stackoverflow.com/questions/25829939/specification-defining-ecdsa-signature-data
               * <br>
               * the signature is TLV encoded.
               * the first byte is 30, the "signature" type<br>
               * the second byte is the length (always 44)<br>
               * the third byte is 02, the "number: type<br>
               * the fourth byte is the length of R (always 20)<br>
               * the byte after the encoded number is 02, the "number: type<br>
               * the byte after is the length of S (always 20)<br>
               * <p>
               * eg:
               * 304402200262675396fbcc768bf505c9dc05728fd98fd977810c547d1a10c7dd58d18802022069c9c4a38ee95b4f394e31a3dd6a63054f8265ff9fd2baf68a9c4c3aa8c5d47e9000
               * is
               * 30LL0220RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR0220SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS
               */

              let rLenHex = response.substring(6, 8);
              // process.stdout.write( "Ledger Signature rLenHex " + rLenHex + "\n" );
              let rLen = parseInt(rLenHex, 16) * 2;
              // process.stdout.write( "Ledger Signature rLen " + rLen + "\n" );
              let rStart = 8;
              // process.stdout.write( "Ledger Signature rStart " + rStart + "\n" );
              let rEnd = rStart + rLen;
              // process.stdout.write( "Ledger Signature rEnd " + rEnd + "\n" );

              while (
                response.substring(rStart, rStart + 2) == "00" &&
                rEnd - rStart > 64
              ) {
                rStart += 2;
              }

              let r = response.substring(rStart, rEnd);
              process.stdout.write(
                "Ledger Signature R [" +
                  rStart +
                  "," +
                  rEnd +
                  "]:" +
                  (rEnd - rStart) +
                  " " +
                  r +
                  "\n"
              );
              let sLenHex = response.substring(rEnd + 2, rEnd + 4);
              // process.stdout.write( "Ledger Signature sLenHex " + sLenHex + "\n" );
              let sLen = parseInt(sLenHex, 16) * 2;
              // process.stdout.write( "Ledger Signature sLen " + sLen + "\n" );
              let sStart = rEnd + 4;
              // process.stdout.write( "Ledger Signature sStart " + sStart + "\n" );
              let sEnd = sStart + sLen;
              // process.stdout.write( "Ledger Signature sEnd " + sEnd + "\n" );

              while (
                response.substring(sStart, sStart + 2) == "00" &&
                sEnd - sStart > 64
              ) {
                sStart += 2;
              }

              let s = response.substring(sStart, sEnd);
              process.stdout.write(
                "Ledger Signature S [" +
                  sStart +
                  "," +
                  sEnd +
                  "]:" +
                  (sEnd - sStart) +
                  " " +
                  s +
                  "\n"
              );

              let msgHashStart = sEnd + 4;
              let msgHashEnd = msgHashStart + 64;
              let msgHash = response.substring(msgHashStart, msgHashEnd);
              process.stdout.write(
                "Ledger Signature msgHash [" +
                  msgHashStart +
                  "," +
                  msgHashEnd +
                  "] " +
                  msgHash +
                  "\n"
              );

              signature = r + s;
              signatureInfo =
                "Signature of Length [" + signature.length + "] : " + signature;
              process.stdout.write(signatureInfo + "\n");
            }
          })
          .catch(function(reason) {
            comm.device.close();
            signatureInfo = "An error occured[1]: " + reason;
            process.stdout.write("Signature Reponse " + signatureInfo + "\n");
          });
      }
    })
    .catch(function(reason) {
      comm.device.close();
      signatureInfo = "An error occured[2]: " + reason;
      process.stdout.write("Signature Reponse " + signatureInfo + "\n");
    });
};

const apiURL = val => {
  return `https://min-api.cryptocompare.com/data/price?fsym=${val}&tsyms=USD`;
};

// form validators for input fields
const validateForm = (dispatch, ledgerBalanceNeo, ledgerBalanceGAS, asset) => {
  // check for valid address
  try {
    if (
      verifyAddress(sendAddress.value) !== true ||
      sendAddress.value.charAt(0) !== "A"
    ) {
      dispatch(sendEvent(false, "The address you entered was not valid."));
      setTimeout(() => dispatch(clearTransactionEvent()), 1000);
      return false;
    }
  } catch (e) {
    dispatch(sendEvent(false, "The address you entered was not valid."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
    return false;
  }
  // check for fractional neo
  if (
    asset === "Neo" &&
    parseFloat(sendAmount.value) !== parseInt(sendAmount.value)
  ) {
    dispatch(sendEvent(false, "You cannot send fractional amounts of Neo."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
    return false;
  } else if (asset === "Neo" && parseInt(sendAmount.value) > ledgerBalanceNeo) {
    // check for value greater than account balance
    dispatch(sendEvent(false, "You do not have enough NEO to send."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
    return false;
  } else if (
    asset === "Gas" &&
    parseFloat(sendAmount.value) > ledgerBalanceGAS
  ) {
    dispatch(sendEvent(false, "You do not have enough GAS to send."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
    return false;
  } else if (parseFloat(sendAmount.value) < 0) {
    // check for negative asset
    dispatch(sendEvent(false, "You cannot send negative amounts of an asset."));
    setTimeout(() => dispatch(clearTransactionEvent()), 1000);
    return false;
  }
  return true;
};

// open confirm pane and validate fields
const openAndValidate = (
  dispatch,
  ledgerBalanceNeo,
  ledgerBalanceGAS,
  asset
) => {
  if (
    validateForm(dispatch, ledgerBalanceNeo, ledgerBalanceGAS, asset) === true
  ) {
    dispatch(togglePane("confirmPane"));
  }
};

export const sendTransactionLedger = (
  sendEntries: Array<SendEntryType>
) => async (dispatch: DispatchType, getState: GetStateType): Promise<*> => {
  const state = getState();
  const wif = getWIF(state);
  const fromAddress = getAddress(state);
  const net = getNetwork(state);
  const balances = getBalances(state);
  const signingFunction = getSigningFunction(state);
  const publicKey = getPublicKey(state);
  const isHardwareSend = getIsHardwareLogin(state);

  const rejectTransaction = (message: string) =>
    dispatch(showErrorNotification({ message }));

  const error = validateTransactionsBeforeSending(balances, sendEntries);

  if (error) {
    return rejectTransaction(error);
  }

  dispatch(
    showInfoNotification({ message: "Sending Transaction...", autoDismiss: 0 })
  );

  log(
    net,
    "SEND",
    fromAddress,
    // $FlowFixMe
    sendEntries.map(({ address, amount, symbol }) => ({
      to: address,
      asset: symbol,
      amount: parseFloat(amount)
    }))
  );

  if (isHardwareSend) {
    dispatch(
      showInfoNotification({
        message: "Please sign the transaction on your hardware device",
        autoDismiss: 0
      })
    );
  }

  const [err, config] = await asyncWrap(
    makeRequest(sendEntries, {
      net,
      address: fromAddress,
      publicKey,
      privateKey: new wallet.Account(wif).privateKey,
      signingFunction: isHardwareSend ? signingFunction : null
    })
  );

  if (err || !config || !config.response || !config.response.result) {
    console.log(err);
    return rejectTransaction("Transaction failed!");
  } else {
    return dispatch(
      showSuccessNotification({
        message:
          "Transaction complete! Your balance will automatically update when the blockchain has processed it."
      })
    );
  }
};

// perform send transaction
const sendTransactionOld = (
  dispatch,
  net,
  selfAddress,
  wif,
  asset,
  ledgerBalanceNeo,
  ledgerBalanceGAS
) => {
  // validate fields again for good measure (might have changed?)
  if (
    validateForm(dispatch, ledgerBalanceNeo, ledgerBalanceGAS, asset) === true
  ) {
    dispatch(
      sendEvent(true, "Please sign the transaction on your hardware device")
    );
    log(net, "SEND", selfAddress, {
      to: sendAddress.value,
      asset: asset,
      amount: sendAmount.value
    });
    doSendAsset(net, sendAddress.value, wif, asset, sendAmount.value)
      .then(response => {
        if (response.result === undefined || response.result === false) {
          dispatch(sendEvent(false, "Transaction failed!"));
        } else {
          dispatch(
            sendEvent(
              true,
              "Transaction complete! Your balance will automatically update when the blockchain has processed it."
            )
          );
        }
        setTimeout(() => dispatch(clearTransactionEvent()), 1000);
      })
      .catch(e => {
        dispatch(sendEvent(false, "Transaction failed!"));
        setTimeout(() => dispatch(clearTransactionEvent()), 1000);
      });
  }
  // close confirm pane and clear fields
  dispatch(togglePane("confirmPane"));
  sendAddress.value = "";
  sendAmount.value = "";
  confirmButton.blur();
};

class LoginLedgerNanoS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: true,
      gas: 0,
      neo: 0,
      neo_usd: 0,
      gas_usd: 0,
      value: 0,
      inputEnabled: true,
      ledgerAddress: "No Address Found. Click to Refresh",
      ledgerBalanceNeo: 0,
      ledgerBalanceGas: 0,
      ledgerNEOUSD: 0,
      ledgerGASUSD: 0,
      ledgerAvailable: false,
      publicKey: "",
      publicKeyEncoded: "",
      filledBalance: {}
    };
    this.handleChangeNeo = this.handleChangeNeo.bind(this);
    this.handleChangeGas = this.handleChangeGas.bind(this);
    this.handleChangeUSD = this.handleChangeUSD.bind(this);
  }

  async componentDidMount() {
    net = this.props.net;
    let neo = await axios.get(apiURL("NEO"));
    let gas = await axios.get(apiURL("GAS"));
    neo = neo.data.USD;
    gas = gas.data.USD;
    this.setState({ neo: neo, gas: gas });
  }

  async getLedgerAddress() {
    try {
      let result = await commNode.list_async();

      let message = Buffer.from(`8004000000${BIP44_PATH}`, "hex");
      let comm = await commNode.create_async();

      const validStatus = [0x9000];
      let response = await comm.exchange(message.toString("hex"), validStatus);

      let publicKeyEncoded = await wallet.getPublicKeyEncoded(
        response.substring(0, 130)
      );

      let loadAccount = new wallet.Account(publicKeyEncoded);

      this.props.dispatch(setAddress(loadAccount.address));
      this.props.dispatch(setPublicKey(publicKeyEncoded));

      this.setState({
        ledgerAddress: loadAccount.address,
        ledgerAvailable: true,
        publicKeyEncoded: publicKeyEncoded
      });

      this.getLedgerBalance(loadAccount.address, this.props.net);

      await initiateGetBalance(
        this.props.dispatch,
        this.props.net,
        loadAccount.address,
        this.props.price
      );

      return loadAccount.address;
    } catch (error) {
      console.log(error);
      this.props.dispatch(
        sendEvent(
          false,
          "Please ensure that your Ledger Nano S is plugged in, unlocked and has the NEO app installed and open"
        )
      );
      setTimeout(() => this.props.dispatch(clearTransactionEvent()), 5000);

      if (error === "Invalid status 6e00") {
        this.props.dispatch(
          sendEvent(
            false,
            "Neo app on Ledger not open, Please open and try again"
          )
        );
        setTimeout(() => this.props.dispatch(clearTransactionEvent()), 5000);
      }
    }
  }

  async getLedgerBalance(address, net) {
    const filledBalance = await api.getBalanceFrom(
      { net: net, address: address },
      api.neonDB
    );

    this.setState({
      filledBalance: filledBalance,
      ledgerBalanceNeo: filledBalance.balance.NEO.balance,
      ledgerBalanceGas: filledBalance.balance.GAS.balance
    });

    await this.getPrice(
      filledBalance.balance.NEO.balance,
      filledBalance.balance.GAS.balance
    );
  }

  handleChangeNeo(event) {
    this.setState({ value: event.target.value }, (sendAmount = value));
    const value = event.target.value * this.state.neo;
    this.setState({ neo_usd: value });
  }

  async getPrice(neo, gas) {
    let ledgerNEOUSD, ledgerGASUSD;
    try {
      let neoPrice = await axios.get(
        `https://min-api.cryptocompare.com/data/price?fsym=NEO&tsyms=USD`
      );

      let gasPrice = await axios.get(
        `https://min-api.cryptocompare.com/data/price?fsym=GAS&tsyms=USD`
      );

      ledgerGASUSD = gasPrice.data.USD * gas;
      ledgerNEOUSD = neoPrice.data.USD * neo;

      this.setState({ ledgerGASUSD, ledgerNEOUSD });

      this.props.dispatch(setCombinedBalance(ledgerGASUSD + ledgerNEOUSD));
    } catch (error) {
      console.log(error);
    }
  }

  handleChangeGas(event) {
    this.setState({ value: event.target.value }, (sendAmount = value));
    const value = event.target.value * this.state.gas;
    this.setState({ gas_usd: value });
  }

  async handleChangeUSD(event) {
    this.setState({ gas_usd: event.target.value });
    let gas = await axios.get(apiURL("GAS"));
    gas = gas.data.USD;
    this.setState({ gas: gas });
    console.log("done");
    const value = this.state.gas_usd / this.state.gas;
    this.setState({ value: value }, (sendAmount = value));
  }

  async handleSubmit() {
    await encodeTransaction(
      this.state.publicKeyEncoded,
      this.props.selectedAsset,
      this.state.ledgerAddress,
      this.state.ledgerBalanceNeo,
      this.state.ledgerBalanceGas
    );
    await createSignature();
    await signTransaction(this.state.publicKeyEncoded);

    this.props.dispatch(
      sendEvent(false, "Please Confirm Using the Device's Buttons")
    );

    setTimeout(() => this.props.dispatch(clearTransactionEvent()), 3000);
  }

  async send() {
    await sendTransaction(this.props.net);
  }

  render() {
    const {
      dispatch,
      wif,
      address,
      status,
      neo,
      gas,
      net,
      confirmPane,
      selectedAsset
    } = this.props;

    let btnClass;
    let formClass;
    let priceUSD = 0;
    let gasEnabled = false;
    let inputEnabled = true;
    let convertFunction = this.handleChangeNeo;
    if (selectedAsset === "Neo") {
      btnClass = "btn-send";
      convertFunction = this.handleChangeNeo;
      formClass = "form-send-neo";
      priceUSD = this.state.neo_usd;
      inputEnabled = true;
    } else if (selectedAsset === "Gas") {
      gasEnabled = true;
      inputEnabled = false;
      btnClass = "btn-send-gas";
      formClass = "form-send-gas";
      priceUSD = this.state.gas_usd;
      convertFunction = this.handleChangeGas;
    }

    const { ledgerAvailable } = this.state;

    return (
      <div className="main-container">
        <div className="">
          <div className="header">
            <div className="col-xs-5">
              <p className="market-price center">
                NEO {numeral(this.props.marketNEOPrice).format("$0,0.00")}
              </p>
              <p className="neo-text">
                {this.props.neo} <span>NEO</span>
              </p>
              <hr className="dash-hr" />
              <p className="neo-balance">
                {numeral(this.props.price).format("$0,0.00")} US
              </p>
            </div>

            {/* this.props.dispatch,
              this.props.net,
              this.props.address,
              this.props.publicKey,
              this.props.neo */}

            <div className="col-xs-2">{<ClaimLedgerGas {...this.props} />}</div>

            <div className="col-xs-5 top-5">
              <p className="market-price center">
                GAS {numeral(this.props.marketGASPrice).format("$0,0.00")}
              </p>
              <p className="gas-text">
                {Math.floor(this.props.gas * 10000000) / 10000000}{" "}
                <span>GAS</span>
              </p>
              <hr className="dash-hr" />
              <p className="neo-balance">
                {" "}
                {numeral(this.props.gasPrice).format("$0,0.00")} USD
              </p>
            </div>
          </div>

          <div
            onClick={() => {
              this.getLedgerAddress();
            }}
            data-tip
            data-for="refreshTip"
            className="ledger-nanos animated fadeInUp"
          />

          <ReactTooltip
            className="solidTip"
            id="refreshTip"
            place="top"
            type="light"
            effect="solid"
          >
            <span>Click to Load Ledger Nano S</span>
          </ReactTooltip>

          {ledgerAvailable ? (
            <div className="row ledger-login-panel fadeInDown">
              <div className="col-xs-4 center">
                <h4
                  data-tip
                  data-for="copyTip"
                  className="pointer"
                  onClick={() => clipboard.writeText(this.state.ledgerAddress)}
                >
                  Copy Ledger Address
                </h4>{" "}
              </div>{" "}
              <ReactTooltip
                className="solidTip"
                id="copyTip"
                place="top"
                type="light"
                effect="solid"
              >
                <span>Copy Ledger Nano S NEO Address</span>
              </ReactTooltip>
              <div className="col-xs-8">
                <input
                  className="ledger-address"
                  onClick={() => clipboard.writeText(this.props.ledgerAddress)}
                  id="center"
                  placeholder={this.state.ledgerAddress}
                  value={this.state.ledgerAddress}
                />
              </div>
              <div className="clearboth" />
              <div className="col-xs-12 center">
                <hr className="dash-hr-wide" />
              </div>
              <div className="clearboth" />
              <div className="row top-20" />
              <div className="clearboth" />
              <div className="col-xs-4">
                <div className="ledgerQRBox center animated fadeInDown">
                  <QRCode size={120} value={this.state.ledgerAddress} />
                </div>
              </div>
              <div className="col-xs-8">
                <h4 className="zero-margin">Send NEO/GAS from Ledger Nano S</h4>
                <div className="top-10">
                  <input
                    className={formClass}
                    id="center"
                    placeholder="Enter a valid NEO public address here"
                    ref={node => {
                      sendAddress = node;
                    }}
                  />
                </div>
              </div>
              <div className="col-xs-4  top-10">
                Amount to Send in NEO/GAS
                <input
                  className={formClass}
                  type="number"
                  id="assetAmount"
                  min="1"
                  onChange={convertFunction}
                  value={this.state.value}
                  placeholder="0"
                  ref={node => {
                    sendAmount = node;
                  }}
                />
              </div>
              <div className="col-xs-4 top-10">
                Value in USD
                <input
                  className={formClass}
                  id="sendAmount"
                  onChange={this.handleChangeUSD}
                  onClick={this.handleChangeUSD}
                  disabled={gasEnabled === false ? true : false}
                  placeholder="Amount in US"
                  value={`${priceUSD}`}
                />
                <label className="amount-dollar-ledger">$</label>
              </div>
              <div className="col-xs-4 top-10">
                <div id="sendAddress">
                  <div
                    id="sendAsset"
                    className={btnClass}
                    style={{ width: "100%" }}
                    data-tip
                    data-for="assetTip"
                    onClick={() => {
                      this.setState({ gas_usd: 0, neo_usd: 0, value: 0 });
                      document.getElementById("assetAmount").value = "";
                      dispatch(toggleAsset());
                    }}
                  >
                    {selectedAsset}
                  </div>

                  <ReactTooltip
                    className="solidTip"
                    id="assetTip"
                    place="top"
                    type="light"
                    effect="solid"
                  >
                    <span>Click to switch between NEO and GAS</span>
                  </ReactTooltip>
                </div>
              </div>
              <div className="col-xs-4 top-10">
                <div id="sendAddress">
                  <button
                    className="grey-button"
                    data-tip
                    data-for="sendTip"
                    onClick={() => this.handleSubmit()}
                    ref={node => {
                      confirmButton = node;
                    }}
                  >
                    <span className="glyphicon glyphicon-send" /> Send
                  </button>
                  <button onClick={() => this.send()}>send</button>
                </div>
              </div>
            </div>
          ) : (
            <div />
          )}

          <div className="top-10 center send-notice"
          >
            <p>
              Please ensure that your Ledger Nano S is plugged in, unlocked and
              has the NEO app installed. Once plugged in your NEO address from
              your Ledger Nano S should appear above.{" "}
              <strong> If not please click on Ledger to refresh.</strong> Ledger
              is a trademark of Ledger SAS, Paris, France. All original owner
              Copyright and Trademark laws apply.
            </p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  marketGASPrice: state.wallet.marketGASPrice,
  marketNEOPrice: state.wallet.marketNEOPrice,
  address: state.account.ledgerAddress,
  net: state.metadata.network,
  wif: state.account.wif,
  ledgerNanoSGetInfoAsync: state.account.ledgerNanoSGetInfoAsync,
  address: state.account.ledgerAddress,
  net: state.metadata.network,
  neo: state.wallet.Neo,
  gas: state.wallet.Gas,
  price: state.wallet.price,
  selectedAsset: state.transactions.selectedAsset,
  confirmPane: state.dashboard.confirmPane,
  combined: state.wallet.combined,
  publicKey: state.account.publicKey
});

LoginLedgerNanoS = connect(mapStateToProps)(LoginLedgerNanoS);

export default LoginLedgerNanoS;
