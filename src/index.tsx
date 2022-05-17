import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import axios from "axios";
import { MetronicLayoutProvider } from "./layout/core/MetronicLayout";
import { MetronicSplashScreenProvider } from "./layout/core/MetronicSplashScreen";
import "./assets/plugins/keenthemes-icons/font/ki.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.css";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store";

const { PUBLIC_URL } = process.env;
axios.defaults.baseURL = "https://tb-dev.dev2.fletrix.hk/api/v1";

ReactDOM.render(
  <React.StrictMode>
    <MetronicLayoutProvider>
      <MetronicSplashScreenProvider>
        <Provider store={store}>
          <PersistGate persistor={persistor}>
            <App basename={PUBLIC_URL} />
          </PersistGate>
        </Provider>
      </MetronicSplashScreenProvider>
    </MetronicLayoutProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
