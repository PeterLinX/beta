import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getBalance,
  getTransactionHistory,
  getClaimAmounts,
  getWalletDBHeight,
  getAPIEndpoint
} from "neon-js";
import { api,wallet } from '@cityofzion/neon-js'
import Neon from '@cityofzion/neon-js'
import { setClaim } from "../modules/claim";
import { setBlockHeight, setNetwork } from "../modules/metadata";
import {
    setBalance,
    setMarketPrice,
    resetPrice,
    setTransactionHistory,
    setBtcTransactionHistory,
    setLtcTransactionHistory,
    setEthTransactionHistory,
    setBtcBalance,
    setLtcBalance,
    setCombinedBalance,
    setEthBalance
} from "../modules/wallet";
import {setBtcBlockHeight,setLtcBlockHeight} from "../modules/metadata";
import { version } from "../../package.json";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import axios from "axios";
import {TOKENS_TEST} from "../core/constants";
import {TOKENS} from "../core/constants";
import { BLOCK_TOKEN } from "../core/constants";
import transactions from "../modules/transactions";

let intervals = {};
let dbcScriptHash, iamScriptHash, nrveScriptHash, ontScriptHash, qlcScriptHash, rhtScriptHash, rpxScriptHash, tkyScriptHash, tncScriptHash, zptScriptHash;
let netSelect;

// https://bittrex.com/api/v1.1/public/getmarkethistory?market=BTC-NEO

// putting this back in wallet, does not belong in neon-js
export const getMarketPriceUSD = amount => {
  return axios
    .get("https://bittrex.com/api/v1.1/public/getticker?market=USDT-NEO")
    .then(response => {
      let lastUSDNEO = Number(response.data.result.Last);
      return lastUSDNEO * amount;
    });
};

const getDbcBalance = async (net,address) => {
    let dbc_token;
    if (net === "MainNet") {
        dbc_token = TOKENS.DBC;
    } else {
        dbc_token = TOKENS_TEST.DBC;
    }
    return getBalace (net,address,dbc_token);
}

const getIamBalance = async (net,address) => {
    let iam_token;
    if (net === "MainNet") {
        iam_token = TOKENS.IAM;
    } else {
        iam_token = TOKENS_TEST.IAM;
    }
    return getBalace (net,address,iam_token);
}

const getNrveBalance = async (net,address) => {
    let nrve_token;
    if (net === "MainNet") {
        nrve_token = TOKENS.NRVE;
    } else {
        nrve_token = TOKENS_TEST.NRVE;
    }
    return getBalace (net,address,nrve_token);
}


const getOntBalance = async (net,address) => {
    let ont_token;
    if (net === "MainNet") {
        ont_token = TOKENS.ONT;
    } else {
        ont_token = TOKENS_TEST.ONT;
    }
    return getBalace (net,address,ont_token);
}

const getQlcBalance = async (net,address) => {
    let qlc_token;
    if (net === "MainNet") {
        qlc_token = TOKENS.QLC;
    } else {
        qlc_token = TOKENS_TEST.QLC;
    }
    return getBalace	(net,address,qlc_token);
}

const getRhtBalance = async (net,address) => {
    let rht_token;
    if (net === "MainNet") {
        rht_token = TOKENS.RHT;
    } else {
        rht_token = TOKENS_TEST.RHT;
    }
    return getBalace	(net,address,rht_token);
}

const getRpxBalance = async (net,address) => {
    let rpx_token;
    if (net === "MainNet") {
        rpx_token = TOKENS.RPX;
    } else {
        rpx_token = TOKENS_TEST.RPX;
    }
    return getBalace	(net,address,rpx_token);
}

const getTkyBalance = async (net,address) => {
    let tky_token;
    if (net === "MainNet") {
        tky_token = TOKENS.TKY;
    } else {
        tky_token = TOKENS_TEST.TKY;
    }
    return getBalace	(net,address,tky_token);
}

const getTncBalance = async (net,address) => {
    let tnc_token;
    if (net === "MainNet") {
        tnc_token = TOKENS.TNC;
    } else {
        tnc_token = TOKENS_TEST.TNC;
    }
    return getBalace	(net,address,tnc_token);
}

const getZptBalance = async (net,address) => {
    let zpt_token;
    if (net === "MainNet") {
        zpt_token = TOKENS.ZPT;
    } else {
        zpt_token = TOKENS_TEST.ZPT;
    }
    return getBalace	(net,address,zpt_token);
}

const getBalace = async (net,address,token) => {
    const endpoint = await api.neonDB.getRPCEndpoint(net);
    console.log("endpoint = "+endpoint);
    const  scriptHash  = token;
    try {
        const response = await api.nep5.getToken(endpoint, scriptHash, address);
        console.log("nep5 balance response = "+JSON.stringify(response));
        //const balance = toBigNumber(response.balance || 0).round(response.decimals).toString();
        //console.log("balance success "+balance);
        return response.balance;

    } catch (err) {
        // invalid scriptHash
        console.log("invalid scriptHash")
        return 0;
    }
}


const getGasPrice = async gasVal => {
  try {
    let gas = await axios.get("https://api.coinmarketcap.com/v1/ticker/gas/");
    gas = gas.data[0].price_usd;
    const value = gasVal * gas;
    return value;
  } catch (error) {
    console.log(error);
  }
};

const getMarketPrice = async () => {
  try {
    let marketPrices = await axios.get(
      "https://min-api.cryptocompare.com/data/pricemulti?fsyms=GAS,NEO,BTC,DBC,ELA,ETH,LTC,LRC,QLC,RPX,TNC,TKY,XMR,ELA,ZPT&tsyms=USD"
    );
    console.log("market price="+JSON.stringify(marketPrices));
    return marketPrices;
  } catch (error) {
    console.log(error);
  }
};


const getUnspentAmount = (transactions,tx_hash) => {
    for (let i = 0; i < transactions.length ; i++) {
        if (transactions[i].tx_hash === tx_hash
            && transactions[i].tx_input_n === -1
            && transactions[i].tx_output_n === 1){
            return parseFloat(transactions[i].value/100000000);
        }
    }
    return 0;
}

const syncEthTransactionHistory = async (dispatch,net,address) => {
    console.log("start eth transaction history");
    let txs = [];
    let base;
    if (net === "MainNet") {
        base = "https://api.blockcypher.com/v1/eth/main/addrs/" + address + "?token=" + BLOCK_TOKEN;
    } else {
        base = "https://api.blockcypher.com/v1/beth/test/addrs/" + address + "?token=" + BLOCK_TOKEN;
    }

    let response = await axios.get(base);
    let transactions = response.data.txrefs;
    console.log('sync eth transactions = '+JSON.stringify(transactions));
    if(transactions != undefined) {
        for (let i = 0; i < transactions.length; i++){
            let unique = transactions[i].tx_input_n + transactions[i].tx_output_n;
            if (unique == -1) {
                let amount,unspent_amount;
                if (transactions[i].tx_input_n === -1 && transactions[i].tx_output_n === 0) {
                    amount = parseFloat(transactions[i].value/100000000);
                    console.log("amount = "+ amount);
                } else if (transactions[i].tx_input_n === 0 && transactions[i].tx_output_n === -1){
                    amount = (-1)*parseFloat(transactions[i].value/100000000);
                    let tx_hash = transactions[i].tx_hash;
                    unspent_amount = getUnspentAmount(transactions,tx_hash)
                    amount = amount + unspent_amount;
                    console.log("out amount=" + amount);
                }

                txs = txs.concat([
                    {
                        type: "ETH",
                        amount: amount,
                        txid: transactions[i].tx_hash,
                        block_index: transactions[i].block_height
                    }
                ]);
            }
        }

        dispatch(setEthTransactionHistory(txs));
    }

}

const syncLtcTransactionHistory = async (dispatch,net,address) => {
    console.log("start ltc transaction history")
    let txs = [];
    let base;
    if(net === "MainNet") {
        base = "https://api.blockcypher.com/v1/ltc/main/addrs/" + address;
    } else {
        base = "https://api.blockcypher.com/v1/ltc/test3/addrs/" + address;
    }

    let response = await axios.get(base);
    let transactions = response.data.txrefs;
    console.log('sync ltc transactions = '+JSON.stringify(transactions))
    if (transactions !== undefined) {
        for (let i = 0; i < transactions.length; i++) {
            let unique = transactions[i].tx_input_n + transactions[i].tx_output_n;
            if (unique == -1) {
                let amount,unspent_amount;
                if (transactions[i].tx_input_n === -1 && transactions[i].tx_output_n === 0) {
                    amount = parseFloat(transactions[i].value/100000000);
                    console.log("amount = "+ amount);
                } else if (transactions[i].tx_input_n === 0 && transactions[i].tx_output_n === -1){
                    amount = (-1)*parseFloat(transactions[i].value/100000000);
                    let tx_hash = transactions[i].tx_hash;
                    unspent_amount = getUnspentAmount(transactions,tx_hash)
                    amount = amount + unspent_amount;
                    console.log("out amount=" + amount);
                }

                txs = txs.concat([
                    {
                        type: "LTC",
                        amount: amount,
                        txid: transactions[i].tx_hash,
                        block_index: transactions[i].block_height
                    }
                ]);
            }
        }

    }
    console.log("ltc txs\n")
    console.log(JSON.stringify(txs));
    dispatch(setLtcTransactionHistory(txs));

}

const syncBtcTransactionHistory = async (dispatch,net,address) => {
    console.log("Start get btc transactions history\n");
    let amount;
    let txs = [];
    let base;

    if(net === "MainNet") {
        base = "http://api.blockcypher.com/v1/btc/main/addrs/" + address;
    } else {
        base = "http://api.blockcypher.com/v1/btc/test3/addrs/" + address;
    }

    let response = await axios.get(base);
    let transactions = response.data.txrefs;
    console.log("transactions\n");
    console.log(JSON.stringify(transactions));
    if (transactions !== undefined) {
        for (let i = 0; i < transactions.length; i++) {
            let unique = transactions[i].tx_input_n + transactions[i].tx_output_n
            if (unique == -1){
                let amount,unspent_amount;
                if (transactions[i].tx_input_n === -1 && transactions[i].tx_output_n === 0) {
                    amount = parseFloat(transactions[i].value/100000000);
                } else if (transactions[i].tx_input_n === 0 && transactions[i].tx_output_n === -1){
                    amount = (-1)*parseFloat(transactions[i].value/100000000);
                    let tx_hash = transactions[i].tx_hash;
                    unspent_amount = getUnspentAmount(transactions,tx_hash)
                    amount = amount + unspent_amount;
                }
                txs = txs.concat([
                    {
                        type: "BTC",
                        amount: amount,
                        txid: transactions[i].tx_hash,
                        block_index: transactions[i].block_height
                    }
                ]);
            }
        }
        dispatch(setBtcTransactionHistory(txs));
    }
}

const getLtcBalance = async (net , ltc_address) => {
    let base;
    if (net === "MainNet") {
        base = "http://api.blockcypher.com/v1/ltc/main/addrs/";
    } else {
        base = "http://api.blockcypher.com/v1/ltc/test3/addrs/";
    }

    let response = await axios.get(base+ltc_address);

    if (response != undefined) {
        return parseFloat(response.data.balance/100000000)
    } else  {
        return 0
    }
}

const getBtcBalance = async (net , btc_address) => {
    let base;
    if (net === "MainNet") {
        base = "http://api.blockcypher.com/v1/btc/main/addrs/";
    } else {
        base = "http://api.blockcypher.com/v1/btc/test3/addrs/";
    }

    let response = await axios.get(base+btc_address);

    if (response != undefined) {
        return parseFloat(response.data/100000000)
    } else  {
        return 0
    }
}
const initiateEthGetBalance = async (dispatch, net, eth_address) =>{
    syncEthTransactionHistory(dispatch, net, eth_address);
}
const initiateLtcGetBalance = async (dispatch, net, ltc_address) => {
    syncLtcTransactionHistory(dispatch,net,ltc_address);
    const ltc_balance = getLtcBalance(net,ltc_address);
    setLtcBalance(ltc_balance);
}

const initiateBtcGetBalance = async (dispatch, net, btc_address) => {
    syncBtcTransactionHistory(dispatch ,net ,btc_address);
    const btc_balance = getBtcBalance(net,btc_address);
    setBtcBalance(btc_balance);
}

// TODO: this is being imported by Balance.js, maybe refactor to helper file/

const initiateGetBalance = (dispatch, net, address ,btc ,ltc ,eth) => {
  syncTransactionHistory(dispatch, net, address);
  syncAvailableClaim(dispatch, net, address);
  syncBlockHeight(dispatch, net);

  if (net == "MainNet") {
      rpxScriptHash = Neon.CONST.CONTRACTS.RPX;
  } else {
      rpxScriptHash = Neon.CONST.CONTRACTS.TEST_RPX;
  }

  return getBalance(net, address)
    .then(resultBalance => {
      return getMarketPriceUSD(resultBalance.Neo)
        .then(async resultPrice => {
          if (resultPrice === undefined || resultPrice === null) {
            dispatch(setBalance(resultBalance.Neo, resultBalance.Gas, "--"));
          } else {
            let gasPrice = await getGasPrice(resultBalance.Gas);
            let marketPrices = await getMarketPrice();

            let dbc_usd = parseFloat(marketPrices.data.DBC.USD);

            let qlc_usd = parseFloat(marketPrices.data.QLC.USD);

            let rpx_usd = parseFloat(marketPrices.data.RPX.USD);

            let tky_usd = parseFloat(marketPrices.data.TKY.USD);

            let tnc_usd = parseFloat(marketPrices.data.TNC.USD);

            let zpt_usd = parseFloat(marketPrices.data.ZPT.USD);

            let btc_usd = parseFloat(marketPrices.data.BTC.USD);

            let ltc_usd = parseFloat(marketPrices.data.LTC.USD);

            let eth_usd = parseFloat(marketPrices.data.ETH.USD);

            let dbcBalance = await getDbcBalance(net,address);
            console.log("dbc balance= " + dbcBalance);

            let iamBalance = await getIamBalance(net,address);
            console.log("iam balance= " + iamBalance);

            let nrveBalance = await getNrveBalance(net,address);
            console.log("nrve balance= " + nrveBalance);

            let ontBalance = await getOntBalance(net,address);
            console.log("ont balance= " + ontBalance);

            let qlcBalance = await getQlcBalance(net,address);
            console.log("qlc balance= " + qlcBalance);

            let rhtBalance = await getRhtBalance(net,address);
            console.log("rht balance= " + rhtBalance);

            let rpxBalance = await getRpxBalance(net,address);
            console.log("rpx balance= " + rpxBalance);

            let tkyBalance = await getTkyBalance(net,address);
            console.log("tky balance= " + tkyBalance);

            let tncBalance = await getTncBalance(net,address);
            console.log("tnc balance= " + tncBalance);

            let zptBalance = await getZptBalance(net,address);
            console.log("zpt balance= " + zptBalance);

            //combined balance updating
            let combinedPrice = gasPrice + resultPrice + dbcBalance*dbc_usd + qlcBalance*qlc_usd + rpxBalance*rpx_usd
                + tkyBalance*tky_usd + tncBalance*tnc_usd + zptBalance*zpt_usd + btc*btc_usd + ltc*ltc_usd + eth*eth_usd;
            dispatch(
              setBalance(
                resultBalance.Neo,
                resultBalance.Gas,
                dbcBalance,
                ontBalance,
                qlcBalance,
                rpxBalance,
                tkyBalance,
                tncBalance,
                zptBalance,
                rhtBalance,
                nrveBalance,
                resultPrice,
                combinedPrice,
                gasPrice,
                marketPrices.data.GAS.USD,
                marketPrices.data.NEO.USD,
                marketPrices.data.BTC.USD,
                marketPrices.data.DBC.USD,
                marketPrices.data.ELA.USD,
                marketPrices.data.ETH.USD,
                marketPrices.data.LTC.USD,
                marketPrices.data.LRC.USD,
                marketPrices.data.QLC.USD,
                marketPrices.data.RPX.USD,
                marketPrices.data.TNC.USD,
                marketPrices.data.TKY.USD,
                marketPrices.data.XMR.USD,
                marketPrices.data.ZPT.USD
              )
            );
          }
          return true;
        })
        .catch(e => {
          dispatch(setBalance(resultBalance.Neo, resultBalance.Gas, "--"));
        });
    })
    .catch(result => {
      // If API dies, still display balance
    });
};

const syncAvailableClaim = (dispatch, net, address) => {
  getClaimAmounts(net, address).then(result => {
    //claimAmount / 100000000
    dispatch(setClaim(result.available, result.unavailable));
  });
};

const syncBlockHeight = (dispatch, net) => {
  getWalletDBHeight(net).then(blockHeight => {
    dispatch(setBlockHeight(blockHeight));
  });
};

const syncTransactionHistory = (dispatch, net, address) => {
  getTransactionHistory(net, address).then(transactions => {
    let txs = [];
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].neo_sent === true) {
        txs = txs.concat([
          {
            type: "NEO",
            amount: transactions[i].NEO,
            txid: transactions[i].txid,
            block_index: transactions[i].block_index
          }
        ]);
      }
      if (transactions[i].gas_sent === true) {
        txs = txs.concat([
          {
            type: "GAS",
            amount: transactions[i].GAS,
            txid: transactions[i].txid,
            block_index: transactions[i].block_index
          }
        ]);
      }
    }
    dispatch(setTransactionHistory(txs));
  });
};

const resetBalanceSync = (dispatch, net, address ,btc ,ltc, eth) => {
  if (intervals.balance !== undefined) {
    clearInterval(intervals.balance);
  }
  intervals.balance = setInterval(() => {
    initiateGetBalance(dispatch, net, address ,btc ,ltc ,eth);
  }, 30000);
};

const toggleNet = (dispatch, net, address ,btc ,ltc ,eth) => {
  let newNet;
  if (net === "MainNet") {
    newNet = "TestNet";
  } else {
    newNet = "MainNet";
  }
  dispatch(setNetwork(newNet));
  resetBalanceSync(dispatch, newNet, address ,btc ,ltc ,eth);
  if (address !== null) {
    initiateGetBalance(dispatch, newNet, address ,btc ,ltc ,eth);
  }
};

class NetworkSwitch extends Component {
  componentDidMount = () => {
    resetBalanceSync(this.props.dispatch, this.props.net, this.props.address,this.props.btc,this.props.ltc,this.props.eth);
  };
  render = () => (
    <div
      id="network"
      onClick={() =>
        toggleNet(this.props.dispatch, this.props.net, this.props.address , this.props.btc ,this.props.ltc,this.props.eth)
      }
    >
      <div className="dash-icon-bar">
        <div className="icon-border">
          <span className="glyphicon glyphicon-exclamation-sign" />
        </div>
        <span className="transparent">Running on </span>
        <span className="netName">{this.props.net}</span>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  net: state.metadata.network,
  address: state.account.address,
  btc: state.account.Btc,
  ltc: state.account.Ltc,
  eth: state.account.Eth
});

NetworkSwitch = connect(mapStateToProps)(NetworkSwitch);

export {
  NetworkSwitch,
  initiateGetBalance,
  syncTransactionHistory,
  syncBtcTransactionHistory,
  syncEthTransactionHistory,
  syncLtcTransactionHistory,
  initiateBtcGetBalance,
  initiateLtcGetBalance,
  intervals,
  resetBalanceSync,
  initiateEthGetBalance,
};
