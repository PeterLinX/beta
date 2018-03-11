import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import numeral from "numeral";
import { Link } from "react-router";

import { setMarketPrice, resetPrice } from "../modules/wallet";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import { initiateGetBalance, intervals } from "../components/NetworkSwitch";

import acatLogo from "../img/acat.png";
import apexLogo from "../img/apex.png";
import thorLogo from "../img/thor.png";
import nrveLogo from "../img/nrve.png";
import effectLogo from "../img/effect.png";
import neoLogo from "../img/neo.png";
import gasLogo from "../img/gas.png";
import btcLogo from "../img/btc-logo.png";
import ltcLogo from "../img/litecoin.png";
import rpxLogo from "../img/rpx.png";
import tncLogo from "../img/tnc.png";
import tkyLogo from "../img/tky.png";
import zptLogo from "../img/zpt.png";
import qlcLogo from "../img/qlc.png";
import thekeyLogo from "../img/thekey.png";
import ontLogo from "../img/ont.png";
import iamLogo from "../img/bridge.png";
import nexLogo from "../img/nex.png";
import deepLogo from "../img/deep.png";
import elasLogo from "../img/elastos.png";
import lrcLogo from "../img/lrc.png";
import hashpuppiesLogo from "../img/hashpuppies.png";
import moneroLogo from "../img/monero.png";
import ethLogo from "../img/eth.png";


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




// force sync with balance data
const refreshBalance = async (dispatch, net, address) => {
	dispatch(sendEvent(true, "Refreshing..."));
	initiateGetBalance(dispatch, net, address).then(response => {
		dispatch(sendEvent(true, "Received latest blockchain information."));
		setTimeout(() => dispatch(clearTransactionEvent()), 1000);
	});
};


class AssetPortolio extends Component {
	constructor(props) {
		super(props);
		this.state = {
      gasPrice: 0,
			dbcPrice: 0,
			iamPrice: 0,
			nrvePrice: 0,
			ontPrice: 0,
			qlcPrice: 0,
			rpxPrice: 0,
			tkyPrice: 0,
			tncPrice: 0,
			zptPrice: 0
		};

	}

	render() {
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

            <div className="col-xs-2"
            onClick={() => {
              this.getLedgerAddress();
            }}
            >{<ClaimLedgerGas {...this.props} />}</div>

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
                {numeral(Math.round(this.props.gasPrice * 100) / 100).format(
                  "$0,0.00"
                )}{" "} USD
              </p>
            </div>
          </div>

          <div
						onClick={() => clipboard.writeText(this.state.ledgerAddress)}
						data-tip
						data-for="refreshTip"
						className="ledger-nanos animated fadeInUp"
					/>

				<div className="row top-30 dash-portfolio center">
				<div id="assetList-ledger">
				<div className="clearboth" />
				<div className="row" />


        <div className="col-3 ">
        <div className="port-logo-col">
        <img
          src={acatLogo}
          alt="Alpha Cat"
          width="66"
          className="port-logos"
        />
        <hr className="dash-hr" />
        <h3><Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-send "/></Link></h3>
        </div>

        <div className="port-price-col">
          <span className="market-price">Alpha Cat $0.00</span>
          <h3>{numeral(this.props.acat).format("0,0.00000")} <span className="ltc-price"> ACAT</span></h3>
          <hr className="dash-hr" />
          <span className="market-price">$0.00 USD</span>
        </div>
        </div>



              <div className="col-3">

              <div className="port-logo-col">
              <img
                src={iamLogo}
                alt=""
                width="38"
                className="port-logos"
              />
              <hr className="dash-hr" />
              <h3><Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-send "/></Link></h3>
              </div>

              <div className="port-price-col">
                <span className="market-price">Bridge $0.00</span>
                <h3>{numeral(
                  Math.floor(this.props.iam * 100000) / 100000
                ).format("0,0.0000")}<span className="qlink-price"> IAM</span></h3>
                <hr className="dash-hr" />
                <span className="market-price">$0.00 USD</span>
              </div>
              </div>





              <div className="col-3">

              <div className="port-logo-col">
              <img
                src={deepLogo}
                alt=""
                width="44"
                className="port-logos"
              />
              <hr className="dash-hr" />
              <h3><Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-send "/></Link></h3>
              </div>

              <div className="port-price-col">
                <span className="market-price">Deep Brain {numeral(this.props.marketDBCPrice).format("$0,0.00")}</span>
                <h3>{numeral(
                  Math.floor(this.props.dbc * 100000) / 100000
                ).format("0,0.0000")} <span className="dbc-price"> DBC</span></h3>
                <hr className="dash-hr" />
                <span className="market-price">{numeral(this.props.dbc*this.props.marketDBCPrice).format("$0,0.00")} USD</span>
              </div>
              </div>



            <div className="col-3 ">
            <div className="port-logo-col">
            <img
              src={effectLogo}
              alt="Effect.ai"
              width="44"
              className="port-logos"
            />
            <hr className="dash-hr" />
            <h3><Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>  <Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-send "/></Link></h3>
            </div>

            <div className="port-price-col">
              <span className="market-price">Effect.ai $0.00</span>
              <h3>{numeral(this.props.efx).format("0,0.00000")} <span className="ltc-price"> EFX</span></h3>
              <hr className="dash-hr" />
              <span className="market-price">$0.00 USD</span>
            </div>
            </div>



            <div className="col-3">
            <div className="port-logo-col">
            <img
              src={gasLogo}
              alt=""
              width="36"
              className="port-logos"
            />
            <hr className="dash-hr" />
            <h3><Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-send "/></Link></h3>
            </div>
            <div className="port-price-col">
              <span className="market-price">GAS {numeral(this.props.marketGASPrice).format("$0,0.00")}</span>
              <h3>{numeral(
                Math.floor(this.props.gas * 100000) / 100000
              ).format("0,0.0000")} <span className="gas-price"> GAS</span></h3>
              <hr className="dash-hr" />
              <span className="market-price">{" "}
                {numeral(Math.round(this.props.gasPrice * 100) / 100).format(
                  "$0,0.00"
                )}{" "} USD</span>
            </div>
          </div>



              <div className="col-3">
              <div className="port-logo-col">
              <img
                src={hashpuppiesLogo}
                alt=""
                width="44"
                className="port-logos"
              />
              <hr className="dash-hr" />
              <h3><Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>  <Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-send "/></Link></h3>
              </div>
              <div className="port-price-col">
                <span className="market-price">Hash Puppies</span>
                <h3>{numeral(
                  Math.floor(this.props.rht * 10) / 10
                ).format("0,0")} <span className="neo-price"> RHT</span></h3>
                <hr className="dash-hr" />
                <span className="market-price">Priceless</span>
              </div>
              </div>




              <div className="col-3">

              <div className="port-logo-col">
              <img
                src={lrcLogo}
                alt=""
                width="40"
                className="port-logos"
              />
              <hr className="dash-hr" />
              <h3><span className=" glyphicon glyphicon-qrcode marg-right-5"/>   <span className=" glyphicon glyphicon-send "/></h3>
              </div>

              <div className="port-price-col">
                <span className="market-price">Loopring {numeral(this.props.marketLRCPrice).format("$0,0.00")}</span>
                <h3>{numeral(
                  Math.floor(this.props.lrc * 100000) / 100000
                ).format("0,0.0000")} <span className="eth-price"> LRC</span></h3>
                <hr className="dash-hr" />
                <span className="market-price">$0.00 USD</span>
              </div>
              </div>

            <div className="col-3">
            <div className="port-logo-col">
            <img
              src={nrveLogo}
              alt=""
              width="36"
              className="port-logos"
            />
            <hr className="dash-hr" />
            <h3><Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-send "/></Link></h3>
            </div>
            <div className="port-price-col">
              <span className="market-price">Narrative $0.00</span>
              <h3>{numeral(this.props.nrve).format("0,0.0000")} <span className="dbc-price"> NRVE</span></h3>
              <hr className="dash-hr" />
              <span className="market-price">$0.00 USD</span>
            </div>
            </div>





            <div className="col-3">
            <div className="port-logo-col">
            <img
              src={neoLogo}
              alt=""
              width="36"
              className="port-logos"
            />
            <hr className="dash-hr" />
            <h3><Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-send "/></Link></h3>
            </div>
            <div className="port-price-col">
              <span className="market-price">NEO {numeral(this.props.marketNEOPrice).format("$0,0.00")}</span>
              <h3>{numeral(this.props.neo).format("0,0")} <span className="neo-price"> NEO</span></h3>
              <hr className="dash-hr" />
              <span className="market-price">{numeral(this.props.price).format("$0,0.00")} USD</span>
            </div>
            </div>




            <div className="col-3 ">
            <div className="port-logo-col">
            <img
              src={nexLogo}
              alt=""
              width="44"
              className="port-logos top-10"
            />
            <hr className="dash-hr" />
            <h3><Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-send "/></Link></h3>
            </div>

            <div className="port-price-col">
              <span className="market-price">Neon Exchange $0.00</span>
              <h3>{numeral(this.props.cpx).format("0,0.00000")} <span className="nex-price"> NEX</span></h3>
              <hr className="dash-hr" />
              <span className="market-price">$0.00 USD</span>
            </div>
            </div>




              <div className="col-3">

              <div className="port-logo-col">
              <img
                src={ontLogo}
                alt=""
                width="48"
                className="port-logos"
              />
              <hr className="dash-hr" />
              <h3><Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-send "/></Link></h3>
              </div>

              <div className="port-price-col">
                <span className="market-price">Ontology $0.00</span>
                <h3>{numeral(
                  Math.floor(this.props.ont * 100000) / 100000
                ).format("0,0.0000")} <span className="dbc-price"> ONT</span></h3>
                <hr className="dash-hr" />
                <span className="market-price">$0.00 USD</span>
              </div>
              </div>


              <div className="col-3">

              <div className="port-logo-col">
              <img
                src={qlcLogo}
                alt=""
                width="50"
                className="port-logos"
              />
              <hr className="dash-hr" />
              <h3><Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-send "/></Link></h3>
              </div>

              <div className="port-price-col">
                <span className="market-price">QLink {numeral(this.props.marketQLCPrice).format("$0,0.00")}</span>
                <h3>{numeral(
                  Math.floor(this.props.qlc * 100000) / 100000
                ).format("0,0.0000")} <span className="qlink-price"> QLC</span></h3>
                <hr className="dash-hr" />
                <span className="market-price">{numeral(this.props.qlc*this.props.marketQLCPrice).format("$0,0.00")} USD</span>
              </div>
              </div>



              <div className="col-3">

              <div className="port-logo-col">
              <img
                src={rpxLogo}
                alt=""
                width="84"
                className="port-logos"
              />
              <hr className="dash-hr" />
              <h3><Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-send "/></Link></h3>
              </div>

              <div className="port-price-col">
                <span className="market-price">Red Pulse {numeral(this.props.marketRPXPrice).format("$0,0.00")}</span>
                <h3>{numeral(
                  Math.floor(this.props.rpx * 100000) / 100000
                ).format("0,0.0000")} <span className="rpx-price"> RPX</span></h3>
                <hr className="dash-hr" />
                <span className="market-price">{numeral(this.props.rpx * this.props.marketRPXPrice).format("$0,0.00")} USD</span>
              </div>
              </div>



            <div className="col-3 ">
            <div className="port-logo-col">
            <img
              src={thorLogo}
              alt=""
              width="44"
              className="port-logos"
            />
            <hr className="dash-hr" />
            <h3><Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-send "/></Link></h3>
            </div>

            <div className="port-price-col">
              <span className="market-price">THOR $0.00</span>
              <h3>{numeral(this.props.cpx).format("0,0.00000")} <span className="thor-price"> THOR</span></h3>
              <hr className="dash-hr" />
              <span className="market-price">$0.00 USD</span>
            </div>
            </div>




              <div className="col-3">

              <div className="port-logo-col">
              <img
                src={tkyLogo}
                alt=""
                width="46"
                className="port-logos"
              />
              <hr className="dash-hr" />
              <h3><Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-send "/></Link></h3>
              </div>

              <div className="port-price-col">
                <span className="market-price">The Key {numeral(this.props.marketTKYPrice).format("$0,0.00")}</span>
                <h3>{numeral(
                  Math.floor(this.props.tky * 100000) / 100000
                ).format("0,0.0000")} <span className="dbc-price"> TKY</span></h3>
                <hr className="dash-hr" />
                <span className="market-price">{numeral(this.props.tky*this.props.marketTKYPrice).format("$0,0.00")} USD</span>
              </div>
              </div>



              <div className="col-3">

              <div className="port-logo-col">
              <img
                src={tncLogo}
                alt=""
                width="50"
                className="port-logos"
              />
              <hr className="dash-hr" />
              <h3><Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-send "/></Link></h3>
              </div>

              <div className="port-price-col">
                <span className="market-price">Trinity {numeral(this.props.marketTNCPrice).format("$0,0.00")}</span>
                <h3>{numeral(
                  Math.floor(this.props.tnc * 100000) / 100000
                ).format("0,0.0000")} <span className="qlink-price"> TNC</span></h3>
                <hr className="dash-hr" />
                <span className="market-price">{numeral(this.props.tnc*this.props.marketTNCPrice).format("$0,0.00")} USD</span>
              </div>
              </div>



              <div className="col-3">

              <div className="port-logo-col">
              <img
                src={zptLogo}
                alt=""
                width="38"
                className="port-logos"
              />
              <hr className="dash-hr" />
              <h3><Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-qrcode marg-right-5"/></Link>   <Link to="/LoginLedgerNanoS"><span className=" glyphicon glyphicon-send "/></Link></h3>
              </div>

              <div className="port-price-col">
                <span className="market-price">Zeepin {numeral(this.props.marketZPTPrice).format("$0,0.00")}</span>
                <h3>{numeral(
                  Math.floor(this.props.zpt * 100000) / 100000
                ).format("0,0.0000")} <span className="neo-price"> ZPT</span></h3>
                <hr className="dash-hr" />
                <span className="market-price">{numeral(this.props.zpt*this.props.marketZPTPrice).format("$0,0.00")} USD</span>
              </div>
              </div>
              </div>
				</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({
  gas: state.wallet.Gas,
	neo: state.wallet.Neo,
	dbc: state.wallet.Dbc,
	iam: state.wallet.Iam,
	nrve: state.wallet.Nrve,
	ont: state.wallet.Ont,
	qlc: state.wallet.Qlc,
	rht: state.wallet.Rht,
	rpx: state.wallet.Rpx,
	tky: state.wallet.Tky,
	tnc: state.wallet.Tnc,
	zpt: state.wallet.Zpt,
  address: state.account.ledgerAddress,
  net: state.metadata.network,
  price: state.wallet.price,
  gasPrice: state.wallet.gasPrice,
  marketGASPrice: state.wallet.marketGASPrice,
	marketNEOPrice: state.wallet.marketNEOPrice,
	marketBTCPrice: state.wallet.marketBTCPrice,
	marketDBCPrice: state.wallet.marketDBCPrice,
	marketELAPrice: state.wallet.marketELAPrice,
	marketETHPrice: state.wallet.marketETHPrice,
	marketLTCPrice: state.wallet.marketLTCPrice,
	marketLRCPrice: state.wallet.marketLRCPrice,
	marketQLCPrice: state.wallet.marketQLCPrice,
	marketRPXPrice: state.wallet.marketRPXPrice,
	marketTNCPrice: state.wallet.marketTNCPrice,
	marketTKYPrice: state.wallet.marketTKYPrice,
	marketXMRPrice: state.wallet.marketXMRPrice,
	marketZPTPrice: state.wallet.marketZPTPrice,
  sendPane: state.dashboard.sendPane,
  confirmPane: state.dashboard.confirmPane,
  blockHeight: state.metadata.blockHeight,
  combined: state.wallet.combined
});

AssetPortolio = connect(mapStateToProps)(AssetPortolio);

export default AssetPortolio;
