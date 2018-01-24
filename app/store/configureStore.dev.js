import { createStore, applyMiddleware, compose } from "redux";
import thunk from 'redux-thunk';
import rootReducer from "./reducers";
import logger from 'redux-logger';
import DevTools from "../containers/DevTools";

const enhancer = compose(
    applyMiddleware(thunk, logger),
    DevTools.instrument()
);

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);
  return store;
}
