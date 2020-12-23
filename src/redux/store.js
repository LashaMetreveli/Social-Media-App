import { createStore, compose, applyMiddleware } from "redux";
import userReduser from "./userReduser";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const middleware = [];

const rootStore = createStore(
  userReduser,
  composeEnhancers(applyMiddleware(...middleware))
);

export default rootStore;
