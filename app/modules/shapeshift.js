import axios from "axios";
import { sendEvent, clearTransactionEvent } from "../modules/transactions";
// Use either official ShapeShift API or Postman mock API based on environment
const baseUrl = process.env.NODE_ENV === "production" ? "https://shapeshift.io" : "https://3e84236c-9ef9-47dc-ba46-c51fdd34411a.mock.pstmn.io";
// const baseUrl = "https://shapeshift.io";

// Constants
export const NEO_STATUS_REQUEST = "NEO_STATUS_REQUEST";
export const NEO_STATUS_AVAILABLE = "NEO_STATUS_AVAILABLE";
export const NEO_STATUS_UNAVAILABLE = "NEO_STATUS_UNAVAILABLE";

export const POST_ORDER = "POST_ORDER";
export const ORDER_SUCCESS = "ORDER_SUCCESS";
export const ORDER_FAIL = "ORDER_FAIL";

export const DEPOSIT_STATUS_REQUEST = "DEPOSIT_STATUS_REQUEST";
export const DEPOSIT_STATUS_SUCCESS = "DEPOSIT_STATUS_SUCCESS";
export const DEPOSIT_STATUS_FAIL = "DEPOSIT_STATUS_FAIL";

export const PROCESS_SUCCESS = "PROCESS_SUCCESS";
export const RESET_ORDER = "RESET_ORDER";

// Actions
export const requestNeoStatus = () => ({ type: NEO_STATUS_REQUEST });
export const setNeoAvailable = () => ({ type: NEO_STATUS_AVAILABLE });
export const setNeoUnavailable = (error = null) => ({ type: NEO_STATUS_UNAVAILABLE, error });

export const startOrder = () => ({ type: POST_ORDER });
export const setOrderSuccess = (txData) => ({ type: ORDER_SUCCESS, txData });
export const setOrderFail = (error) => ({ type: ORDER_FAIL, error });

export const requestDepositStatus = () => ({ type: DEPOSIT_STATUS_REQUEST });
export const setDepositStatusSuccess = () => ({ type: DEPOSIT_STATUS_SUCCESS });
export const setDepositStatusFail = (error = null) => ({ type: DEPOSIT_STATUS_FAIL, error });

export const setProcessingSuccess = (completeData) => ({ type: PROCESS_SUCCESS, completeData });

export const resetOrderState = () => ({ type: RESET_ORDER });


// Thunks
export function fetchNeoStatus() {
	return async function(dispatch) {
		dispatch(requestNeoStatus());
		const url = `${baseUrl}/getcoins`;
		try {
			const response = await axios.get(url);
			const NEO = await response.data.NEO;
			NEO.status === "available" ? dispatch(setNeoAvailable()) : dispatch(setNeoUnavailable());
		} catch(e) {
			dispatch(setNeoUnavailable(e));
		}
	};
}

export function startShiftOrder(shiftConfig) {
	return async function(dispatch) {
		// why isn't this dispatching startOrder?
		dispatch(startOrder());
		const url = `${baseUrl}/sendamount`;
		try {
			// deleting returnAddress for now as it is not a valid one currently being passed
			delete shiftConfig.returnAddress;
			const response = await axios.post(url, shiftConfig);
			const txData = response.data;
			txData.error
				? dispatch(setOrderFail(txData.error),
					dispatch(sendEvent(false, txData.error)),
					setTimeout(() => dispatch(clearTransactionEvent()), 3000))
				: dispatch(setOrderSuccess(txData.success));
		} catch(e) {
			dispatch(setOrderFail(e));
			dispatch(sendEvent(false, e.message));
			setTimeout(() => dispatch(clearTransactionEvent()), 3000);
		}
	};
}
// create a thunk that will check the deposit status at an address and dispatch the proper actions based on the outcome
export function fetchDepositStatus(depositAddress) {
	return async function(dispatch) {
		dispatch(requestDepositStatus());
		const url = `${baseUrl}/txStat/${depositAddress}`;
		try {
			const response = await axios.get(url);
			const depositData = response.data;
			if (depositData.status === "no_deposits") dispatch(setDepositStatusFail());
			else if (depositData.status === "failed") {
				dispatch(setDepositStatusFail(depositData.error));
				dispatch(sendEvent(false, depositData.error));
				setTimeout(() => dispatch(clearTransactionEvent()), 3000);
			}
			else if (depositData.status === "received") dispatch(setDepositStatusSuccess());
			else if (depositData.status === "complete") dispatch(setProcessingSuccess(depositData));
		} catch(e) {
			dispatch(setDepositStatusFail(e.message));
			dispatch(sendEvent(false, e.message));
			setTimeout(() => dispatch(clearTransactionEvent()), 3000);
		}
	};
}


// Reducer
const initialState = {
	fetching: false, // true when fetching NEO status or deposit status at address
	available: false,
	stage: null, // possible states - null, ordering, depositing, processing, complete
	txData: {},
	completeData: {},
	error: null
};

export default (
	state = initialState,
	action
) => {
	switch (action.type) {
	case NEO_STATUS_REQUEST:
		return { ...state, fetching: true, error: null };
	case NEO_STATUS_AVAILABLE:
		return { ...state, fetching: false, available: true, error: null };
	case NEO_STATUS_UNAVAILABLE:
		return { ...state, fetching: false, available: false, error: action.error };
	case POST_ORDER:
		return { ...state, stage: "ordering" };
	case ORDER_SUCCESS:
		return { ...state, stage: "depositing", txData: action.txData, error: null };
	case ORDER_FAIL:
		return { ...state, error: action.error, stage: null };
	case DEPOSIT_STATUS_REQUEST:
		return { ...state, fetching: true };
	case DEPOSIT_STATUS_SUCCESS:
		return { ...state, stage: "processing", fetching: false, error: null };
	case DEPOSIT_STATUS_FAIL:
		return { ...state, fetching: false, error: action.error };
	case PROCESS_SUCCESS:
		return { ...state, fetching: false, stage: "complete", completeData: action.completeData, error: null };
	case RESET_ORDER:
		return initialState;
	default:
		return state;
	}
};

// As of Jan 29, 2018

// Create Order (POST /shapeshift.io/sendamount)

// response0 = {
// 	"success": {
// 	"orderId": "7e96d399-161b-4d7e-86e8-4526ee0267a2",
// 		"pair": "eth_btc",
// 		"withdrawal": "18J5MzAASt2FEAiFaM7RCG2Wm8xsV5Ttb2",
// 		"withdrawalAmount": "0.001",
// 		"deposit": "0x8c12e756075039cfaccfc911bf1e176ec1ecae42",
// 		"depositAmount": "0.01737582",
// 		"expiration": 1517257160162,
// 		"quotedRate": "0.10359224",
// 		"maxLimit": 4.28045779,
// 		"returnAddress": "0xa4ece67a446ff949c2cb27ad76439b39740164bb",
// 		"apiPubKey": "5aad9888213a9635ecda3ed8bb2dc45c0a8d95dc36da7533c78f3eba8f765ce77538aae79d0e35642e39f208b7428631188f03c930e91f299f9eb40556f8e74d",
// 		"minerFee": "0.0008"
// 	}
// }
// response1 = {
// 	"error": "NEO is currently unavailable."
// }

// Fetch Deposit Status (GET /shapeshift.io/txStat/txId
// response0 = {
// 	"status": "no_deposits"
// }
// response1 = {
//	"status": "error"
//}
// response2 = {
// "status": "received",
// 	"address": "0x8c12e756075039cfaccfc911bf1e176ec1ecae42",
// 	"withdraw": "18J5MzAASt2FEAiFaM7RCG2Wm8xsV5Ttb2",
// 	"incomingCoin": 0.01737582,
// 	"incomingType": "ETH"
// }
// response3 = {
// 	"status": "complete",
// 	"address": "0x8c12e756075039cfaccfc911bf1e176ec1ecae42",
// 	"withdraw": "18J5MzAASt2FEAiFaM7RCG2Wm8xsV5Ttb2",
// 	"incomingCoin": 0.01737582,
// 	"incomingType": "ETH",
// 	"outgoingCoin": "0.001",
// 	"outgoingType": "BTC",
// 	"transaction": "81d85afaac59d41135fbbae3306818e79d8801029786f0d60f9c850523e30bca",
// 	"transactionURL": "https://blockchain.info/tx/81d85afaac59d41135fbbae3306818e79d8801029786f0d60f9c850523e30bca"
// }

