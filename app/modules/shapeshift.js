import axios from "axios";

// Constants
export const NEO_STATUS_REQUEST = "NEO_STATUS_REQUEST";
export const NEO_STATUS_AVAILABLE = "NEO_STATUS_AVAILABLE";
export const NEO_STATUS_UNAVAILABLE = "NEO_STATUS_UNAVAILABLE";
export const POST_ORDER = "POST_ORDER";
export const ORDER_SUCCESS = "ORDER_SUCCESS";
export const ORDER_FAIL = "ORDER_FAIL";
export const DEPOSIT_SUCCESS = "DEPOSIT_SUCCESS";
export const PROCESS_SUCCESS = "PROCESS_SUCCESS";
export const RESET_ORDER = "RESET_ORDER";

// Actions
export const requestNeoStatus = () => ({ type: NEO_STATUS_REQUEST });
export const setNeoAvailable = () => ({ type: NEO_STATUS_AVAILABLE });
export const setNeoUnavailable = (error = null) => ({ type: NEO_STATUS_UNAVAILABLE, error });

export const postOrder = () => () => ({ type: POST_ORDER });
export const setOrderSuccess = (txData) => ({ type: ORDER_SUCCESS, txData });
export const setOrderFail = (err) => ({ type: ORDER_FAIL, err });
// export const setDepositSuccess = () => ({ type: DEPOSIT_SUCCESS });
// export const setProcessingSuccess = () => ({ type: PROCESS_SUCCESS });
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
		dispatch(postOrder());
		const url = "https://shapeshift.io/shift";
		try {
			const response = await axios.post(url, shiftConfig);
			const txData = response.data;
			dispatch(setOrderSuccess(txData));
		} catch(e) {
			dispatch(setOrderFail());
		}
	};
}

// create a thunk that will check the deposit status and dispatch the proper actions based on the outcome
// export function checkDepositStatus(depositAddress) {
// 	return async function(dispatch) {
//
// 	}
// }


// Reducer

const initialState = {
	fetching: false,
	available: false,
	stage: null, // possible states - null, ordering, depositing, processing, complete
	txData: {},
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
	case DEPOSIT_SUCCESS:
		return { ...state, stage: "processing" };
	case PROCESS_SUCCESS:
		return { ...state, stage: "complete" };
	case RESET_ORDER:
		return initialState;
	default:
		return state;
	}
};



