import React, { Component } from "react";
import { connect } from "react-redux";
import {
  getBalance,
  getTransactionHistory,
  getClaimAmounts,
  getWalletDBHeight,
  getAPIEndpoint
} from "neon-js";
import Neon, { api, wallet } from "@cityofzion/neon-js";
import { setClaim } from "../modules/claim";
import { setBlockHeight, setNetwork } from "../modules/metadata";
import {
    setBalance,
    setMarketPrice,
    resetPrice,
    setCombinedBalance,
    setTransactionHistory,
    setBtcTransactionHistory,
    setLtcTransactionHistory,
    setEthTransactionHistory,
    setLrcTransactionHistory,
    setEosTransactionHistory,
    setElaTransactionHistory,
    setBtcBalance,
    setLtcBalance,
    setEosBalance,
    setEthBalance,
    setElaBalance,
    setLrcBalance
} from "../modules/wallet";
import {setBtcBlockHeight,setLtcBlockHeight} from "../modules/metadata";
import { version } from "../../package.json";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
import axios from "axios";
import { TOKENS_TEST } from "../core/constants";
import { ETHERIO_TOKEN } from "../core/constants";
import { TOKENS } from "../core/constants";
import { BLOCK_TOKEN } from "../core/constants";
import transactions from "../modules/transactions";

let intervals = {};
let acatScriptHash, aphScriptHash, dbcScriptHash, efxScriptHash, galaScriptHash, gdmScriptHash, iamScriptHash, avaScriptHash, cpxScriptHash, lrnScriptHash, mctScriptHash, nrveScriptHash, obtScriptHash, ontScriptHash, pkcScriptHash,  qlcScriptHash, rhtScriptHash, rpxScriptHash, thorScriptHash, tkyScriptHash, tncScriptHash, swhtScriptHash, wwbScriptHash,  xqtScriptHash, zptScriptHash;
let netSelect;


export const getMarketPriceUSD = amount => {
  return axios
    .get("https://bittrex.com/api/v1.1/public/getticker?market=USDT-NEO")
    .then(response => {
      let lastUSDNEO = Number(response.data.result.Last);
      return lastUSDNEO * amount;
    });
};

const getAcatBalance = async (net,address) => {
    let acat_token;
    if (net === "MainNet") {
        acat_token = TOKENS.ACAT;
    } else {
        acat_token = TOKENS_TEST.ACAT;
    }
    return getTokenBalance (net,address,acat_token);
}

const getAphBalance = async (net,address) => {
    let aph_token;
    if (net === "MainNet") {
        aph_token = TOKENS.APH;
    } else {
        aph_token = TOKENS_TEST.APH;
    }
    return getTokenBalance (net,address,aph_token);
}

const getAvaBalance = async (net,address) => {
    let ava_token;
    if (net === "MainNet") {
        ava_token = TOKENS.AVA;
    } else {
        ava_token = TOKENS_TEST.AVA;
    }
    return getTokenBalance (net,address,ava_token);
}

const getCgeBalance = async (net,address) => {
    let cge_token;
    if (net === "MainNet") {
        cge_token = TOKENS.CGE;
    } else {
        cge_token = TOKENS_TEST.CGE;
    }
    return getTokenBalance (net,address,cge_token);
}

const getCpxBalance = async (net,address) => {
    let cpx_token;
    if (net === "MainNet") {
        cpx_token = TOKENS.CPX;
    } else {
        cpx_token = TOKENS_TEST.CPX;
    }
    return getTokenBalance (net,address,cpx_token);
}

const getDbcBalance = async (net,address) => {
    let dbc_token;
    if (net === "MainNet") {
        dbc_token = TOKENS.DBC;
    } else {
        dbc_token = TOKENS_TEST.DBC;
    }
    return getTokenBalance (net,address,dbc_token);
}

const getEfxBalance = async (net,address) => {
    let efx_token;
    if (net === "MainNet") {
        efx_token = TOKENS.EFX;
    } else {
        efx_token = TOKENS_TEST.EFX;
    }
    return getTokenBalance (net,address,efx_token);
}

const getGdmBalance = async (net,address) => {
    let gdm_token;
    if (net === "MainNet") {
        gdm_token = TOKENS.GDM;
    } else {
        gdm_token = TOKENS_TEST.GDM;
    }
    return getTokenBalance (net,address,gdm_token);
}

const getGalaBalance = async (net,address) => {
    let gala_token;
    if (net === "MainNet") {
        gala_token = TOKENS.GALA;
    } else {
        gala_token = TOKENS_TEST.GALA;
    }
    return getTokenBalance (net,address,gala_token);
}

const getIamBalance = async (net,address) => {
    let iam_token;
    if (net === "MainNet") {
        iam_token = TOKENS.IAM;
    } else {
        iam_token = TOKENS_TEST.IAM;
    }
    return getTokenBalance (net,address,iam_token);
}

const getLrnBalance = async (net,address) => {
    let lrn_token;
    if (net === "MainNet") {
        lrn_token = TOKENS.LRN;
    } else {
        lrn_token = TOKENS_TEST.LRN;
    }
    return getTokenBalance (net,address,lrn_token);
}

const getMctBalance = async (net,address) => {
    let mct_token;
    if (net === "MainNet") {
        mct_token = TOKENS.MCT;
    } else {
        mct_token = TOKENS_TEST.MCT;
    }
    return getTokenBalance (net,address,mct_token);
}

const getNrveBalance = async (net,address) => {
    let nrve_token;
    if (net === "MainNet") {
        nrve_token = TOKENS.NRVE;
    } else {
        nrve_token = TOKENS_TEST.NRVE;
    }
    return getTokenBalance (net,address,nrve_token);
}

const getObtBalance = async (net,address) => {
    let obt_token;
    if (net === "MainNet") {
        obt_token = TOKENS.OBT;
    } else {
        obt_token = TOKENS_TEST.OBT;
    }
    return getTokenBalance (net,address,obt_token);
}


const getOntBalance = async (net,address) => {
    let ont_token;
    if (net === "MainNet") {
        ont_token = TOKENS.ONT;
    } else {
        ont_token = TOKENS_TEST.ONT;
    }
    return getTokenBalance (net,address,ont_token);
}

const getPkcBalance = async (net,address) => {
    let pkc_token;
    if (net === "MainNet") {
        pkc_token = TOKENS.PKC;
    } else {
        pkc_token = TOKENS_TEST.PKC;
    }
    return getTokenBalance (net,address,pkc_token);
}

const getQlcBalance = async (net,address) => {
    let qlc_token;
    if (net === "MainNet") {
        qlc_token = TOKENS.QLC;
    } else {
        qlc_token = TOKENS_TEST.QLC;
    }
    return getTokenBalance	(net,address,qlc_token);
}

const getRhtBalance = async (net,address) => {
    let rht_token;
    if (net === "MainNet") {
        rht_token = TOKENS.RHT;
    } else {
        rht_token = TOKENS_TEST.RHT;
    }
    return getTokenBalance	(net,address,rht_token);
}

const getRpxBalance = async (net,address) => {
    let rpx_token;
    if (net === "MainNet") {
        rpx_token = TOKENS.RPX;
    } else {
        rpx_token = TOKENS_TEST.RPX;
    }
    return getTokenBalance	(net,address,rpx_token);
}

const getThorBalance = async (net,address) => {
    let thor_token;
    if (net === "MainNet") {
        thor_token = TOKENS.THOR;
    } else {
        thor_token = TOKENS_TEST.THOR;
    }
    return getTokenBalance	(net,address,thor_token);
}

const getTkyBalance = async (net,address) => {
    let tky_token;
    if (net === "MainNet") {
        tky_token = TOKENS.TKY;
    } else {
        tky_token = TOKENS_TEST.TKY;
    }
    return getTokenBalance	(net,address,tky_token);
}

const getTncBalance = async (net,address) => {
    let tnc_token;
    if (net === "MainNet") {
        tnc_token = TOKENS.TNC;
    } else {
        tnc_token = TOKENS_TEST.TNC;
    }
    return getTokenBalance	(net,address,tnc_token);
}

const getSwhtBalance = async (net,address) => {
    let swht_token;
    if (net === "MainNet") {
        swht_token = TOKENS.SWHT;
    } else {
        swht_token = TOKENS_TEST.SWHT;
    }
    return getTokenBalance	(net,address,swht_token);
}

const getWwbBalance = async (net,address) => {
    let wwb_token;
    if (net === "MainNet") {
        wwb_token = TOKENS.WWB;
    } else {
        wwb_token = TOKENS_TEST.WWB;
    }
    return getTokenBalance	(net,address,wwb_token);
}

const getXqtBalance = async (net,address) => {
    let xqt_token;
    if (net === "MainNet") {
        xqt_token = TOKENS.XQT;
    } else {
        xqt_token = TOKENS_TEST.XQT;
    }
    return getTokenBalance	(net,address,xqt_token);
}

const getZptBalance = async (net,address) => {
    let zpt_token;
    if (net === "MainNet") {
        zpt_token = TOKENS.ZPT;
    } else {
        zpt_token = TOKENS_TEST.ZPT;
    }
    return getTokenBalance	(net,address,zpt_token);
}

const getTokenBalance = async (net,address,token) => {
    const endpoint = await api.neonDB.getRPCEndpoint(net);
    console.log("endpoint = "+endpoint);
    const  scriptHash  = token;
    try {
        const response = await api.nep5.getToken("http://seed1.bridgeprotocol.io:10332", scriptHash, address);
        console.log("nep5 balance response = "+JSON.stringify(response));
        return response.balance;

    }
    catch (err) {
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
      "https://min-api.cryptocompare.com/data/pricemulti?fsyms=GAS,NEO,ACAT,BTC,AVA,CPX,DBC,ELA,EOS,ETH,EFX,GALA,GDM,LTC,LRN,MCT,OBT,ONT,QLC,RPX,SWHT,THOR,TNC,TKY,QTUM,XMR,XQT,ZPT&tsyms=USD"
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

const syncElaTransactionHistory = async (dispatch, net, ela_address) => {
    console.log("start ela transaction history");
    let txs = [];
    let amount,txid;
    let base = "https://blockchain.elastos.org/api/v1/txs/?address=" + ela_address + "&pageNum=0";
    let response = await axios.get(base);
    let transactions = response.data.txs;
    if(transactions !== undefined) {
        for (let i = 0; i < transactions.length; i++) {
            let txInfo = transactions[i];
            amount = parseFloat(txInfo.valueOut);
            txid = txInfo.txid
            txs = txs.concat([
                {
                    type: "ELA",
                    amount: amount,
                    txid: txid,
                    block_index: txInfo.blockheight
                }
            ]);
        }
    }
    dispatch(setElaTransactionHistory(txs))
}

const syncEosTransactionHistory = async (dispatch, net, address) => {
    console.log("start eos transaction history");
    let txs = [];
    let base;
    let op_address = "0x" + address;
    if (net === "MainNet") {
        base = "https://api.ethplorer.io/getAddressHistory/" + op_address + "?apiKey=" + ETHERIO_TOKEN;
    } else {
        base = "https://api.ethplorer.io/getAddressHistory/" + op_address + "?apiKey=" + ETHERIO_TOKEN;
    }

    let response = await axios.get(base);
    console.log("eos transaction response = " + JSON.stringify(response))
    let transactions = response.data.operations;
    console.log('sync eos transactions = '+JSON.stringify(transactions));
    if (transactions != undefined) {
        for (let i = 0; i < transactions.length; i++) {
            let tokenInfo = transactions[i].tokenInfo;
            let symbol = tokenInfo.symbol;
            if (symbol == "EOS") {
                let amount = parseFloat(transactions[i].value*0.00000000000000001);
                txs = txs.concat([
                    {
                        type: "EOS",
                        amount: amount,
                        txid: transactions[i].transactionHash
                    }
                ]);
            }

        }
        dispatch(setEosTransactionHistory(txs));
    }
}

const syncLrcTransactionHistory = async (dispatch, net, address) => {
    console.log("start lrc transaction history");
    let txs = [];
    let base;
    let op_address = "0x" + address;
    if (net === "MainNet") {
        base = "https://api.ethplorer.io/getAddressHistory/" + op_address + "?apiKey=" + ETHERIO_TOKEN;
    } else {
        base = "https://api.ethplorer.io/getAddressHistory/" + op_address + "?apiKey=" + ETHERIO_TOKEN;
    }

    let response = await axios.get(base);
    let transactions = response.data.operations;
    console.log('sync lrc transactions = '+JSON.stringify(transactions));
    if (transactions != undefined) {
        for (let i = 0; i < transactions.length; i++) {
            let tokenInfo = transactions[i].tokenInfo;
            let symbol = tokenInfo.symbol;
            if (symbol == "LRC") {
                let amount = parseFloat(transactions[i].value/1000000000000000000);
                txs = txs.concat([
                    {
                        type: "LRC",
                        amount: amount,
                        txid: transactions[i].transactionHash
                    }
                ]);
            }

        }
        dispatch(setLrcTransactionHistory(txs));
    }

}

const syncEthTransactionHistory = async (dispatch,net,address) => {
    console.log("start eth transaction history");
    let txs = [];
    let base;
    if (net === "MainNet") {
        base = "https://api.blockcypher.com/v1/eth/main/addrs/" + address + "?token=" + BLOCK_TOKEN;
    } else {
        base = "https://api.blockcypher.com/v1/eth/test/addrs/" + address + "?token=" + BLOCK_TOKEN;
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
                    amount = parseFloat(transactions[i].value/1000000000000000000);
                    console.log("amount = "+ amount);
                } else if (transactions[i].tx_input_n === 0 && transactions[i].tx_output_n === -1){
                    amount = (-1)*parseFloat(transactions[i].value/1000000000000000000);
                    let tx_hash = transactions[i].tx_hash;
                    unspent_amount = getUnspentAmount(transactions,tx_hash)
                    amount = amount + unspent_amount;
                    console.log("out amount=" + amount);
                }
                txs = txs.concat([
                    {
                        type: "ETH",
                        amount: amount,
                        txid: '0x' + transactions[i].tx_hash,
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



const getEthBalance = async (net , eth_address) => {
    let base;
    if (net === "MainNet") {
        base = "https://api.blockcypher.com/v1/eth/main/addrs/";
    } else {
        base = "https://api.blockcypher.com/v1/eth/test3/addrs/";
    }
    let response = await axios.get(base+eth_address);
    if (response != undefined) {
        return parseFloat(response.data.balance/1000000000000000000)
    } else  {
        return 0
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



const getLrcBalance = async (net, eth_address) => {
    let base, hex_address;

    if (eth_address.value.chatAt(0) == '0' && eth_address.value.chatAt(1)) {
        hex_address = eth_address;
    } else {
        hex_address = '0x' + eth_address;
    }

    if (net == "MainNet") {
         base = "https://api.ethplorer.io/getAddressInfo/" + hex_address + "?apiKey=" + ETHERIO_TOKEN;
    } else {
         base = "https://api.ethplorer.io/getAddressInfo/" + hex_address + "?apiKey=" + ETHERIO_TOKEN;
    }

    let response = await axios.get(base);
    let tokens = response.data.tokens;
    let balance = 0;
    for (let i = 0; i < tokens.length; i++) {
        let token_item = tokens[i];
        let tokenInfo = token_item.tokenInfo;
        if (tokenInfo.symbol === "LRC") {
            balance = token_item.balance;
        }
    }

    return balance;
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

const getElaBalance = async (net, ela_address) => {
    let base = "https://blockchain.elastos.org/api/v1/addr/";
    let res = await axios.get(base+ela_address);
    let balance = parseFloat(res.data.balance);
    console.log("ELAbalance = " + balance);
    return balance;
}

const initiateElaGetBalance = async (dispatch, net, ela_address) => {
    syncElaTransactionHistory(dispatch, net, ela_address);
    const ela_balance = getElaBalance(net,ela_address);
    setElaBalance(ela_balance);
}

const initiateEosGetBalance = async (dispatch, net, eth_address) => {
    syncEosTransactionHistory(dispatch, net, eth_address);
    const eos_balance = getEosBalance(net,eth_address);
    setEosBalance(eos_balance);
}

const initiateLrcGetBalance = async (dispatch, net, eth_address) => {
    syncLrcTransactionHistory(dispatch, net, eth_address);
    const lrc_balance = getLrcBalance(net,eth_address);
    setLrcBalance(lrc_balance);
}

const initiateEthGetBalance = async (dispatch, net, eth_address) =>{
    syncEthTransactionHistory(dispatch, net, eth_address);
    const eth_balance = getEthBalance(net,eth_address);
    setEthBalance(eth_balance);
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

const resetBalanceSync = (dispatch, net, address ,btc ,ltc, eth, ela) => {
  if (intervals.balance !== undefined) {
    clearInterval(intervals.balance);
  }
  intervals.balance = setInterval(() => {
    initiateGetBalance(dispatch, net, address ,btc ,ltc ,eth, ela);
  }, 60000);
};

const toggleNet = (dispatch, net, address ,btc ,ltc ,eth, ela) => {
  let newNet;
  if (net === "MainNet") {
    newNet = "TestNet";
  } else {
    newNet = "MainNet";
  }
  dispatch(setNetwork(newNet));
  resetBalanceSync(dispatch, newNet, address ,btc ,ltc ,eth, ela);
  if (address !== null) {
    initiateGetBalance(dispatch, newNet, address ,btc ,ltc ,eth, ela);
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
  eth: state.account.Eth,
  eos: state.account.Eos,
  ela: state.account.Ela
});

NetworkSwitch = connect(mapStateToProps)(NetworkSwitch);

export {
  NetworkSwitch,
  initiateGetBalance,
  syncTransactionHistory,
  syncBtcTransactionHistory,
  syncEthTransactionHistory,
  syncEosTransactionHistory,
  syncLtcTransactionHistory,
  syncElaTransactionHistory,
  initiateBtcGetBalance,
  initiateLtcGetBalance,
  initiateElaGetBalance,
  initiateEthGetBalance,
  intervals,
  resetBalanceSync,
};
