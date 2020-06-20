import React from "react";
import SignIn from "../auth/SignIn";
import SignUp from "../auth/SignUp";
import { Switch, Route } from "react-router-dom";
import NotFoundPage from "../Page404";
import { DarkStateProps } from "../auth/Copyright";
import ResetPassword from "../auth/Reset_password";
import Dash from "../Dashboard/Index";
import Path from "./Paths.json"

const Routes = (props: DarkStateProps) => {

  return (
    <Switch>
      <Route path={Path.SignIn} exact children={() => <SignIn {...props} />} />
      <Route path={Path.SignUp} exact children={() => <SignUp {...props} />} />
      <Route path={Path.Auth} exact component={Dash} />
      <Route path={Path.Reset} exact component={ResetPassword} />,
      <Route path="*" exact component={NotFoundPage} />,
    </Switch>
  );
};
export default Routes;
