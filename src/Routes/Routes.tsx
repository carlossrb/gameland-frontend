import React from "react";
import SignIn from "../Auth/SignIn";
import SignUp from "../Auth/SignUp";
import { Switch, Route, Redirect } from "react-router-dom";
import NotFoundPage from "../Page404";
import ResetPassword from "../Auth/Reset_password";
import Dash from "../Dashboard/Index";
import Path from "./Paths.json"
import { DarkStateProps } from "../react-app-env";

const Routes = (props: DarkStateProps) => {

  return (
    <Switch>
      <Route path={Path.SignIn} exact children={() => <SignIn {...props} />} />
      <Route path={Path.SignUp} exact children={() => <SignUp {...props} />} />
      <Route path={Path.Auth} exact children={() => <Dash {...props} />} />
      <Route path={Path.Reset} exact component={ResetPassword} />,
      <Route path="*" exact component={NotFoundPage} />,
    </Switch>
  );
};

interface PrivateRouteProps extends DarkStateProps{
  isLoggedIn:boolean
}

//Implementar posteriormente
const PrivateRoute: React.FC <PrivateRouteProps>= (props) =>
  props.isLoggedIn
    ? <Route { ...props } />
    : <Redirect to={Path.SignIn} />

export default Routes;
