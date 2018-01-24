import { createStore, applyMiddleware, compose } from "redux";
import thunk from 'redux-thunk';
import rootReducer from "./reducers";
import logger from 'redux-logger';
import DevTools from "../containers/DevTools";

let enhancer = null;

if (process.env.NODE_ENV === "production") {
    enhancer = compose(
        applyMiddleware(thunk)
    );
} else {
    enhancer = compose(
        applyMiddleware(thunk, logger),
        DevTools.instrument()
    );
}

export default function configureStore(initialState) {
    const store = createStore(rootReducer, initialState, enhancer);
    return store;
}
