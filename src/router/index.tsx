import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Login from "../view/auth/login";
import BasePage from "./BasePage";
import { Layout } from "../layout";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducers";

export function Routes() {
    const token = useSelector((state : RootState) => state.user.appToken);
  return (
    <>
      <Router>
        
        <Switch>
      {!token ? (
        // Redirect to `/auth/login` when user is not authorized
        <Login />
      ) : (
        <Layout>
          <BasePage />
        </Layout>
      )}

      {token ? (
        <Layout>
          <BasePage />
        </Layout>
      ) : (
        <Route>
          <Login />
        </Route>
      )}
    </Switch>
      </Router>
    </>
  );
}
