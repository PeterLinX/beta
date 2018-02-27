// Constants
export const SET_BALANCE = "SET_BALANCE";
export const SET_BTC_BALANCE = "SET_BTC_BALANCE";
export const SET_MARKET_PRICE = "SET_MARKET_PRICE";
export const RESET_PRICE = "RESET_PRICE";
export const SET_TRANSACTION_HISTORY = "SET_TRANSACTION_HISTORY";
export const SET_COMBINED_BALANCE = "SET_COMBINED_BALANCE";

// Actions
export function setBalance(
	neo,
	gas,
	price,
	combined,
	gasPrice,
	marketGASPrice,
	marketNEOPrice,
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
	marketZPTPrice
) {
	return {
		type: SET_BALANCE,
		Neo: neo,
		Gas: gas,
		price: price,
		combined: combined,
		gasPrice: gasPrice,
		marketGASPrice: marketGASPrice,
		marketNEOPrice: marketNEOPrice,
		marketBTCPrice: marketBTCPrice,
		marketDBCPrice: marketDBCPrice,
		marketELAPrice: marketELAPrice,
		marketLTCPrice: marketLTCPrice,
		marketLRCPrice: marketLRCPrice,
		marketQLCPrice: marketQLCPrice,
		marketRPXPrice: marketRPXPrice,
		marketTNCPrice: marketTNCPrice,
		marketTKYPrice: marketTKYPrice,
		marketXMRPrice: marketXMRPrice,
		marketZPTPrice: marketZPTPrice
	};
}

export function setBtcBalance(balance){
	return {
		type: SET_BTC_BALANCE,
		balance: balance
	}
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
		transactions: [],
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
			Rpx: action.Rpx,
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
	case SET_BTC_BALANCE:
		return {
			...state,
			Btc: action.balance
		}
	default:
		return state;
	}
};
