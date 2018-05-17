// Constants
export const SET_BALANCE = "SET_BALANCE";
export const SET_BTC_BALANCE = "SET_BTC_BALANCE";
export const SET_LTC_BALANCE = "SET_LTC_BALANCE";
export const SET_ETH_BALANCE = "SET_ETH_BALANCE";
export const SET_LRC_BALANCE = "SET_LRC_BALANCE";
export const SET_EOS_BALANCE = "SET_EOS_BALANCE";
export const SET_ELA_BALANCE = "SET_ELA_BALANCE";
export const SET_MARKET_PRICE = "SET_MARKET_PRICE";
export const RESET_PRICE = "RESET_PRICE";
export const SET_TRANSACTION_HISTORY = "SET_TRANSACTION_HISTORY";
export const SET_BTC_TRANSACTION_HISTORY = "SET_BTC_TRANSACTION_HISTORY";
export const SET_LTC_TRANSACTION_HISTORY = "SET_LTC_TRANSACTION_HISTORY";
export const SET_ETH_TRANSACTION_HISTORY = "SET_ETH_TRANSACTION_HISTORY";
export const SET_LRC_TRANSACTION_HISTORY = "SET_LRC_TRANSACTION_HISTORY";
export const SET_EOS_TRANSACTION_HISTORY = "SET_EOS_TRANSACTION_HISTORY";
export const SET_ELA_TRANSACTION_HISTORY = "SET_ELA_TRANSACTION_HISTORY";
export const SET_COMBINED_BALANCE = "SET_COMBINED_BALANCE";

// Actions
export function setBalance(
	neo,
	gas,
	acat,
	aph,
	iam,
	ava,
	cge,
	cpx,
	dbc,
	efx,
	gala,
	gdm,
	lrn,
	mct,
	obt,
	ont,
	pkc,
	qlc,
	rpx,
	swht,
	thor,
	tky,
	tnc,
	wwb,
	xqt,
	zpt,
	rht,
	nrve,
	price,
	combined,
	gasPrice,
  marketGASPrice,
	marketNeoPrice,
	marketACATPrice,
  marketBTCPrice,
	marketDBCPrice,
  marketELAPrice,
	marketEOSPrice,
	marketETHPrice,
	marketLTCPrice,
	marketONTPrice,
  marketQLCPrice,
	marketQTUMPrice,
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
		Acat: acat,
		Aph: aph,
		Iam: iam,
		Ava: ava,
		Cge: cge,
		Cpx: cpx,
		Dbc: dbc,
		Efx: efx,
		Gala: gala,
		Gdm: gdm,
		Lrn: lrn,
		Mct: mct,
		Obt: obt,
		Ont: ont,
		Pkc: pkc,
		Qlc: qlc,
		Rpx: rpx,
		Swht: swht,
		Thor: thor,
		Tky: tky,
		Tnc: tnc,
		Wwb: wwb,
		Xqt: xqt,
		Zpt: zpt,
    Rht: rht,
		Nrve: nrve,
		price: price,
		combined: combined,
		gasPrice: gasPrice,
    marketGASPrice: marketGASPrice,
		marketNEOPrice: marketNeoPrice,
		marketACATPrice: marketACATPrice,
		marketBTCPrice: marketBTCPrice,
		marketDBCPrice: marketDBCPrice,
  	marketELAPrice: marketELAPrice,
		marketEOSPrice: marketEOSPrice,
		marketETHPrice: marketETHPrice,
		marketLTCPrice: marketLTCPrice,
		marketONTPrice: marketONTPrice,
		marketQLCPrice: marketQLCPrice,
		marketQTUMPrice: marketQTUMPrice,
		marketRPXPrice: marketRPXPrice,
		marketTNCPrice: marketTNCPrice,
		marketTKYPrice: marketTKYPrice,
		marketXMRPrice: marketXMRPrice,
    marketZPTPrice: marketZPTPrice

	};
}

export function setEosBalance(balance) {
    return {
        type: SET_EOS_BALANCE,
        balance: balance
    };
}

export function setLrcBalance(balance) {
    return {
        type: SET_LRC_BALANCE,
        balance: balance
    };
}

export function setElaBalance(balance) {
    return {
        type: SET_ELA_BALANCE,
        balance: balance
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

export function setEosTransactionHistory(eos_transactions) {
    return {
        type: SET_EOS_TRANSACTION_HISTORY,
        eos_transactions
    };
}

export function setLrcTransactionHistory(lrc_transactions) {
    return {
        type: SET_LRC_TRANSACTION_HISTORY,
        lrc_transactions
    };
}

export function setBtcTransactionHistory(btc_transactions) {
	return {
		type: SET_BTC_TRANSACTION_HISTORY,
        btc_transactions
	};
}

export function setElaTransactionHistory(ela_transactions) {
    return {
        type:SET_ELA_TRANSACTION_HISTORY,
        ela_transactions
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
		Acat: 0,
		Aph: 0,
		Iam: 0,
		Ava: 0,
		Cge: 0,
		Cpx: 0,
		Dbc: 0,
		Efx: 0,
		Ela: 0,
		Gala: 0,
		Gdm: 0,
		Lrn: 0,
		Mct: 0,
		Obt: 0,
		Ont: 0,
		Pkc: 0,
		Rpx: 0,
		Swht: 0,
		Thor: 0,
		Tky: 0,
		Tnc: 0,
		Wwb: 0,
		Xqt: 0,
		Zpt: 0,
		Qlc: 0,
		Btc: 0,
		Ltc: 0,
		Lrc: 0,
		Eos: 0,
		Eth: 0,
		Rht: 0,
		Nrve: 0,
		transactions: [],
		btc_transactions: [],
		ltc_transactions: [],
		ela_transactions: [],
		eth_transactions: [],
    eos_transactions: [],
		lrc_transactions: [],
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
			Acat: action.Acat,
			Aph: action.Aph,
			Iam: action.Iam,
			Ava: action.Ava,
			Cge: action.Cge,
			Cpx: action.Cpx,
			Dbc: action.Dbc,
			Efx: action.Efx,
			Gala: action.Gala,
			Gdm: action.Gdm,
			Lrn: action.Lrn,
			Mct: action.Mct,
			Obt: action.Obt,
			Ont: action.Ont,
			Pkc: action.Pkc,
			Qlc: action.Qlc,
			Rpx: action.Rpx,
			Swht: action.Swht,
			Thor: action.Thor,
			Tky: action.Tky,
			Tnc: action.Tnc,
			Wwb: action.Wwb,
			Xqt: action.Xqt,
			Zpt: action.Zpt,
			Rht: action.Rht,
			Nrve: action.Nrve,
			price: action.price,
			combined: action.combined,
			gasPrice: action.gasPrice,
      marketGASPrice: action.marketGASPrice,
			marketNEOPrice: action.marketNEOPrice,
      marketBTCPrice: action.marketBTCPrice,
			marketACATPrice: action.marketACATPrice,
		  marketDBCPrice: action.marketDBCPrice,
		  marketELAPrice: action.marketELAPrice,
			marketEOSPrice: action.marketEOSPrice,
		  marketETHPrice: action.marketETHPrice,
			marketEFXPrice: action.marketEFXPrice,
			marketGALAPrice: action.marketGALAPrice,
			marketGDMPrice: action.marketGDMPrice,
		  marketLTCPrice: action.marketLTCPrice,
			marketONTPrice: action.marketONTPrice,
		  marketQLCPrice: action.marketQLCPrice,
			marketQTUMPrice: action.marketQTUMPrice,
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
		case SET_ELA_TRANSACTION_HISTORY:
			return {...state,ela_transactions:action.ela_transactions};
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
	case SET_LRC_TRANSACTION_HISTORY:
		return {
			...state,
			lrc_transactions: action.lrc_transactions
		}
	case SET_EOS_TRANSACTION_HISTORY:
		return {
			...state,
			eos_transactions: action.eos_transactions
		}
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
	case SET_ELA_BALANCE:
			return {
				...state,
				Ela:action.balance
		};
	case SET_ETH_BALANCE:
		return {
			...state,
			Eth:action.balance
		};
	case SET_LRC_BALANCE:
		return {
			...state,
			Lrc: action.balance
		}
	case SET_EOS_BALANCE:
		return {
			...state,
			Eos: action.balance
		}
	default:
		return state;
	}
};
