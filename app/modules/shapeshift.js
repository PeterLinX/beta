import axios from "axios";

// Constants
export const NEO_STATUS_REQUEST = "NEO_STATUS_REQUEST";
export const NEO_STATUS_AVAILABLE = "NEO_STATUS_AVAILABLE";
export const NEO_STATUS_UNAVAILABLE = "NEO_STATUS_UNAVAILABLE";

// Actions
export const requestNeoStatus = () => ({ type: NEO_STATUS_REQUEST });
export const setNeoAvailable = () => ({ type: NEO_STATUS_AVAILABLE });
export const setNeoUnavailable = (error = null) => ({ type: NEO_STATUS_UNAVAILABLE, error });


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

// Reducer
export default (
	state = { fetching: false, available: false, error: null },
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



