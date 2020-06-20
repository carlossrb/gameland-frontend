import React, { useState, useLayoutEffect, useContext } from "react";
import { BrowserRouter, Redirect } from "react-router-dom";
import {
  ThemeProvider,
  createMuiTheme,
  CssBaseline,
  Snackbar,
} from "@material-ui/core";
import Routes from "./Routes/Routes";
import { AxiosGet } from "./utils/index";
import { Alert } from "@material-ui/lab";
import PathRoutes from "./Routes/Paths.json";
import logo from "./auth/gameland.io.png";
import { store } from "./Store";

const App: React.FC = () => {
  const UserData = useContext(store)
  const {SetNewData} = UserData
  const [path, setPath] = useState(window.location.pathname);
  const [connected, setConnected] = useState(1);
  const [darkState, setDarkState] = useState(
    localStorage.getItem("darkMode") === null ||
      localStorage.getItem("darkMode") === "true"
      ? true
      : false
  );
  const mainPrimaryColor: string = darkState ? "#0c87c8" : "#602d91";
  const mainSecondaryColor: string = darkState ? "#602d91" : "#0c87c8";
  const palletType = darkState ? "dark" : "light";

  const darkTheme = createMuiTheme({
    palette: {
      type: palletType,
      primary: {
        main: mainPrimaryColor,
      },
      secondary: {
        main: mainSecondaryColor,
      },
    },
  });

  // Redireciona login
  useLayoutEffect(() => {
    const keepConnected =
      localStorage.getItem("keepConnectedGameland") === "true";
    localStorage.setItem("redirectPathGameland", path);
    setConnected(0);
    const pathParts: string = "/" + path.split("/")[1];
    const pathReset: string = PathRoutes.Reset.split("/")[1];

    AxiosGet("/auth/check")
      .then(({data}) => {
        if (keepConnected) {
          setPath(path === PathRoutes.SignIn ? PathRoutes.Auth : path);
        } else setPath(path);
        setConnected(2);
        // popula os dados do redux com o response
        //Global (seta parâmetros no context)
        SetNewData({ type: "LOGIN_DATA", values: data });
      })
      .catch((error) => {
        if (pathParts === "/" + pathReset || pathParts === PathRoutes.SignUp)
          setPath(path);
        else setPath(PathRoutes.SignIn);
        setConnected(3);
      });
  }, []);

  //Fecha Snackbar
  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setConnected(1);
  };

  return connected >= 1 ? (
    <BrowserRouter>
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={connected === 3 && path === PathRoutes.SignIn}
          onClose={handleClose}
          autoHideDuration={6000}
        >
          <Alert variant="filled" severity={"info"}>
            {"Entre no sistema para acessar o conteúdo"}
          </Alert>
        </Snackbar>
        {(connected === 2 || 3) && <Redirect to={path} />}
        <Routes setDarkState={setDarkState} darkState={darkState} />
      </ThemeProvider>
    </BrowserRouter>
  ) : (
    <div style={{ marginTop: 150 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <img src={logo} alt="gameland.io" />
      </div>
    </div>
  );
};

export default App;
