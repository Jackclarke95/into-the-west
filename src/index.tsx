import React from "react";
import ReactDOM from "react-dom";

import { createStore } from "redux";
import { DefaultRootState, Provider } from "react-redux";
import { Action, initialState, rootReducer } from "./Data/Reducers";

import "./Style/index.scss";
import App from "./App";

// Create the Redux store
const store = createStore((prevState, action) => {
  if (prevState) {
    return rootReducer(prevState as DefaultRootState, action as Action);
  }

  return initialState;
}, (window as any).__REDUX_DEVTOOLS_EXTENSION__?.());

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
