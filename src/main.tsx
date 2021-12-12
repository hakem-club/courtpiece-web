import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import App from "./App";
import AppContainer from "./components/AppContainer";
import './i18n';

ReactDOM.render(
  <React.StrictMode>
  <AppContainer>
    <App />
  </AppContainer>
  </React.StrictMode>,
  document.getElementById("root")
);
