import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

let enhancer = null;

if (process.env.NODE_ENV === "production") {
  enhancer = compose(applyMiddleware(thunk));
} else {
  enhancer = compose(applyMiddleware(thunk));
}

export default function configureStore(initialState) {
  const store = createStore(rootReducer, initialState, enhancer);
  return store;
}
