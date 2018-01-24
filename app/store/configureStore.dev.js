import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import rootReducer from "./reducers";
import DevTools from "../containers/DevTools";

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, applyMiddleware(thunk));
  // const store = createStore(rootReducer, initialState, DevTools.instrument());

  return store;
}
