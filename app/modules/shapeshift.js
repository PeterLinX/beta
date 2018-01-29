import axios from "axios";

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

export const startOrder = () => () => ({ type: POST_ORDER });
export const setOrderSuccess = (txData) => ({ type: ORDER_SUCCESS, txData });
export const setOrderFail = (error) => ({ type: ORDER_FAIL, error });

export const requestDepositStatus = () => ({ type: DEPOSIT_STATUS_REQUEST });
export const setDepositStatusSuccess = () => ({ type: DEPOSIT_STATUS_SUCCESS });
export const setDepositStatusFail = (error = null) => ({ type: DEPOSIT_STATUS_FAIL, error });

export const setProcessingSuccess = (completeData) => ({ type: PROCESS_SUCCESS, completeData });

export const resetOrderState = () => ({ type: RESET_ORDER });


// Thunks
export function fetchNeoStatus() {
	return async function (dispatch) {
		dispatch(requestNeoStatus());
		const url = "https://shapeshift.io/getcoins";
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
		dispatch(startOrder());
		const url = "https://shapeshift.io/shift";
		console.log('before try block', shiftConfig);
		try {
			// deleting returnAddress for now as it is not a valid one currently being passed
			delete shiftConfig.returnAddress;
			const response = await axios.post(url, shiftConfig);
			const txData = response.data;
			console.log('txData', txData);
			dispatch(setOrderSuccess(txData));
		} catch(e) {
			console.log('error', e)
			dispatch(setOrderFail());
		}
	};
}

// create a thunk that will check the deposit status at an address and dispatch the proper actions based on the outcome
export function fetchDepositStatus(depositAddress) {
	return async function(dispatch) {
		dispatch(requestDepositStatus());
		const url = `https://shapeshift.io/txStat/${depositAddress}`;
		try {
			const response = await axios.post(url);
			const depositData = response.data;

			if (depositData.status === "no_deposits") dispatch(setDepositStatusFail());
			else if (depositData.status === "failed") dispatch(setDepositStatusFail(depositData.error));
			else if (depositData.status === "received") dispatch(setDepositStatusSuccess());
			else if (depositData.status === "complete") dispatch(setProcessingSuccess(depositData));
		} catch(e) {
			dispatch(setDepositStatusFail());
		}
	};
}


// Reducer

const initialState = {
	fetching: false,
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
		return { ...state, stage: "depositing", txData: action.txData };
	case ORDER_FAIL:
		return { ...state, stage: null };
	case DEPOSIT_STATUS_REQUEST:
		return { ...state, fetching: true };
	case DEPOSIT_STATUS_SUCCESS:
		return { ...state, stage: "processing", fetching: false };
	case DEPOSIT_STATUS_FAIL:
		return { ...state, fetching: false, error: action.error };
	case PROCESS_SUCCESS:
		return { ...state, fetching: false, stage: "complete", completeData: action.completeData };
	case RESET_ORDER:
		return initialState;
	default:
		return state;
	}
};



