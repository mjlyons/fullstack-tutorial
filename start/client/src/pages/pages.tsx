import React from "react";
import { Router } from "@reach/router";

import Launch from "./launch";
import Launches from "./launches";
import Cart from "./cart";
import Profile from "./profile";
import Login from "./login";
import { Footer, PageContainer } from "../components";

export default function Pages(): JSX.Element {
  return (
    <>
      <PageContainer>
        <Router primary={false} component={React.Fragment}>
          <Launches path="/" />
          <Launch path="launch/:launchId" />
          <Cart path="cart" />
          <Profile path="profile" />
          <Login path="login" />
        </Router>
      </PageContainer>
      <Footer />
    </>
  );
}
