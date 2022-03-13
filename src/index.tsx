import React from "react";
import ReactDOM from "react-dom";

import { createStore } from "redux";
import { DefaultRootState, Provider, useSelector } from "react-redux";
import { Action, initialState, rootReducer } from "./Data/Reducers";

import "./index.css";
import App from "./App";
import { mergeStyles, ThemeProvider } from "@fluentui/react";
import { LightTheme } from "./Style/Themes";

// Create the Redux store
const store = createStore((prevState, action) => {
  if (prevState) {
    return rootReducer(prevState as DefaultRootState, action as Action);
  }

  return initialState;
}, (window as any).__REDUX_DEVTOOLS_EXTENSION__?.());

// Inject some global styles
mergeStyles({
  ":global(body,html,#root)": {
    margin: 0,
    padding: 0,
    height: "100vh",
  },
});

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider theme={LightTheme}>
        <App />
      </ThemeProvider>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
