import React, { FC } from "react";
import { BrowserRouter } from "react-router-dom";
import { MaterialThemeProvider } from "./layout/core/MaterialThemeProvider";
import "react-toastify/dist/ReactToastify.css";
// import Loader from "./common/loader";
import { Routes } from "./router";
import "material-ui-rc-color-picker/assets/index.css";
import { ToastContainer } from "react-toastify";
import Loader from "./common/loader";

interface Props {
  basename: string;
}
const App: FC<Props> = ({ basename }) => {
  return (
    <BrowserRouter basename={basename}>
      {/*This library only returns the location that has been active before the recent location change in the current window lifetime.*/}
      <MaterialThemeProvider>
        <div className="App h-100">
          <Routes />
          <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
          />
          <Loader />
        </div>
      </MaterialThemeProvider>
    </BrowserRouter>
  );
};

export default App;
