// Constants
export const SET_BALANCE = "SET_BALANCE";
export const SET_BTC_BALANCE = "SET_BTC_BALANCE";
export const SET_LTC_BALANCE = "SET_LTC_BALANCE";
export const SET_ETH_BALANCE = "SET_ETH_BALANCE";
export const SET_MARKET_PRICE = "SET_MARKET_PRICE";
export const RESET_PRICE = "RESET_PRICE";
export const SET_TRANSACTION_HISTORY = "SET_TRANSACTION_HISTORY";
export const SET_BTC_TRANSACTION_HISTORY = "SET_BTC_TRANSACTION_HISTORY";
export const SET_LTC_TRANSACTION_HISTORY = "SET_LTC_TRANSACTION_HISTORY";
export const SET_ETH_TRANSACTION_HISTORY = "SET_ETH_TRANSACTION_HISTORY";
export const SET_COMBINED_BALANCE = "SET_COMBINED_BALANCE";

// Actions
export function setBalance(
	neo,
	gas,
	dbc,
	ont,
	qlc,
	rpx,
	tky,
	tnc,
	zpt,
	rht,
	nrve,
	price,
	combined,
	gasPrice,
  	marketGASPrice,
	marketNeoPrice,
    marketBTCPrice,
	marketDBCPrice,
    marketELAPrice,
	marketETHPrice,
	marketLTCPrice,
	marketLRCPrice,
    marketQLCPrice,
    marketRPXPrice,
    marketTNCPrice,
    marketTKYPrice,
	marketXMRPrice,
    marketZPTPrice,

) {
	return {
		type: SET_BALANCE,
		Neo: neo,
		Gas: gas,
		Dbc: dbc,
		Ont: ont,
		Qlc: qlc,
		Rpx: rpx,
		Tky: tky,
		Tnc: tnc,
		Zpt: zpt,
    Rht: rht,
		Nrve: nrve,
		price: price,
		combined: combined,
		gasPrice: gasPrice,
    marketGASPrice: marketGASPrice,
		marketNEOPrice: marketNeoPrice,
    marketBTCPrice: marketBTCPrice,
		marketDBCPrice: marketDBCPrice,
    marketELAPrice: marketELAPrice,
		marketETHPrice: marketETHPrice,
		marketLTCPrice: marketLTCPrice,
		marketLRCPrice: marketLRCPrice,
		marketQLCPrice: marketQLCPrice,
		marketRPXPrice: marketRPXPrice,
		marketTNCPrice: marketTNCPrice,
		marketTKYPrice: marketTKYPrice,
		marketXMRPrice: marketXMRPrice,
    marketZPTPrice: marketZPTPrice,
	};
}

export function setLtcBalance(balance) {
	return {
		type: SET_LTC_BALANCE,
		balance: balance
	};
}

export function setBtcBalance(balance){
	return {
		type: SET_BTC_BALANCE,
		balance: balance
	};
}

export function setEthBalance(balance){
    return {
        type: SET_ETH_BALANCE,
        balance: balance
    };
}

export function setCombinedBalance(combinedBalance) {
	return {
		type: SET_COMBINED_BALANCE,
		combined: combinedBalance
	};
}

export function setMarketPrice(price) {
	return {
		type: SET_MARKET_PRICE,
		price: price
	};
}

export function resetPrice() {
	return {
		type: RESET_PRICE
	};
}

export function setBtcTransactionHistory(btc_transactions) {
	return {
		type: SET_BTC_TRANSACTION_HISTORY,
        btc_transactions
	};
}

export function setLtcTransactionHistory(ltc_transactions) {
	return {
		type:SET_LTC_TRANSACTION_HISTORY,
        ltc_transactions
	};
}

export function setEthTransactionHistory(eth_transactions) {
    return {
        type:SET_ETH_TRANSACTION_HISTORY,
        eth_transactions
    };
}

export function setTransactionHistory(transactions) {
	return {
		type: SET_TRANSACTION_HISTORY,
		transactions
	};
}

// reducer for wallet account balance
export default (
	state = {
		Neo: 0,
		Gas: 0,
		Dbc: 0,
		Ont: 0,
		Rpx: 0,
		Tky: 0,
		Tnc: 0,
		Zpt: 0,
		Qlc: 0,
		Btc: 0,
		Ltc: 0,
		Eth: 0,
		Rht: 0,
		Nrve: 0,
		transactions: [],
		btc_transactions: [],
		ltc_transactions: [],
		eth_transactions: [],
		price: "--",
		combined: "--",
		gasPrice: "--",
		marketNEOPrice: "--",
		marketGASPrice: "--"
	},
	action
) => {
	switch (action.type) {
	case SET_BALANCE:
		return {
			...state,
			Neo: action.Neo,
			Gas: action.Gas,
			Dbc: action.Dbc,
			Ont: action.Ont,
			Qlc: action.Qlc,
			Rpx: action.Rpx,
			Tky: action.Tky,
			Tnc: action.Tnc,
			Zpt: action.Zpt,
			Rht: action.Rht,
			Nrve: action.Nrve,
			price: action.price,
			combined: action.combined,
			gasPrice: action.gasPrice,
      		marketGASPrice: action.marketGASPrice,
			marketNEOPrice: action.marketNEOPrice,
      		marketBTCPrice: action.marketBTCPrice,
		    marketDBCPrice: action.marketDBCPrice,
		    marketELAPrice: action.marketELAPrice,
		    marketETHPrice: action.marketETHPrice,
		    marketLTCPrice: action.marketLTCPrice,
		    marketLRCPrice: action.marketLRCPrice,
		    marketQLCPrice: action.marketQLCPrice,
			marketRPXPrice: action.marketRPXPrice,
            marketTNCPrice: action.marketTNCPrice,
            marketTKYPrice: action.marketTKYPrice,
			marketXMRPrice: action.marketXMRPrice,
            marketZPTPrice: action.marketZPTPrice
		};
	case RESET_PRICE:
		return { ...state, price: "--" };
	case SET_COMBINED_BALANCE:
		return { ...state, combined: action.combined };
	case SET_MARKET_PRICE: //current market price action type
		let currentPrice;
		if (action.price !== undefined) {
			currentPrice = action.price;
		} else {
			currentPrice = "--";
		}
		return { ...state, price: currentPrice };
	case SET_TRANSACTION_HISTORY:
		return { ...state, transactions: action.transactions };
	case SET_LTC_TRANSACTION_HISTORY:
		return {...state,ltc_transactions:action.ltc_transactions};
	case SET_BTC_TRANSACTION_HISTORY:
		return {
			...state,
			btc_transactions: action.btc_transactions
		};
	case SET_ETH_TRANSACTION_HISTORY:
		return {
			...state,
			eth_transactions: action.eth_transactions
		};
	case SET_BTC_BALANCE:
		return {
			...state,
			Btc: action.balance
		}
	case SET_LTC_BALANCE:
		return {
			...state,
			Ltc:action.balance
		};
	case SET_ETH_BALANCE:
		return {
			...state,
			Eth:action.balance
		};
	default:
		return state;
	}
};
