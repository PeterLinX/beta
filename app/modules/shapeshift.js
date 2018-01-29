import axios from "axios";

// Constants
export const NEO_STATUS_REQUEST = "NEO_STATUS_REQUEST";
export const NEO_STATUS_AVAILABLE = "NEO_STATUS_AVAILABLE";
export const NEO_STATUS_UNAVAILABLE = "NEO_STATUS_UNAVAILABLE";
export const SHIFT_POST = "SHIFT_POST";
export const SHIFT_SUCCESS = "SHIFT_SUCCESS";
export const SHIFT_FAIL = "SHIFT_FAIL";

// Actions
export const requestNeoStatus = () => ({ type: NEO_STATUS_REQUEST });
export const setNeoAvailable = () => ({ type: NEO_STATUS_AVAILABLE });
export const setNeoUnavailable = (error = null) => ({ type: NEO_STATUS_UNAVAILABLE, error });
export const postShift = () => () => ({	type: SHIFT_POST });
export const setShiftTx = (txData) => ({ type: SHIFT_SUCCESS, txData });
export const setShiftFail = (err) => ({ type: SHIFT_FAIL, err });

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

// should there be a shift boolean?
// should there posting (shift) and fetching (neo status) share state?
export function sendShift(shiftConfig) {
	return async function (dispatch) {
		dispatch(postShift());
		const url = "https://shapeshift.io/shift";
		try {
			const response = await axios.post(url, shiftConfig);
			const txData = response.data;
			dispatch(setShiftTx(txData));
		} catch(e) {
			dispatch(setShiftFail());
		}
	};
}

// Reducer
export default (
	state = { fetching: false, posting: false, available: false, error: null, isShifting: false }, //
	action
) => {
	switch (action.type) {
	case NEO_STATUS_REQUEST:
		return { ...state, fetching: true, error: null };
	case NEO_STATUS_AVAILABLE:
		return { ...state, fetching: false, available: true, error: null };
	case NEO_STATUS_UNAVAILABLE:
		return { ...state, fetching: false, available: false, error: action.error };
	default:
		return state;
	}
};



