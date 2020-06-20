import React, { useState, useContext } from "react";
import { NavLink as LinkRouter, Redirect } from "react-router-dom";
import {
  Link,
  Grid,
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  TextField,
  FormControlLabel,
  Checkbox,
  Snackbar,
  CircularProgress,
  Grow,
} from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import logo from "../auth/gameland.io.png";
import {
  Visibility,
  VisibilityOff,
  VpnKey,
  LockOpen,
  Lock,
} from "@material-ui/icons";
import Password from "./Password";
import { AxiosPost } from "../utils/index";
import { Alert } from "@material-ui/lab";
import Copyright, { DarkStateProps } from "./Copyright";
import { store } from "../Store";

/**
 * Tela principal de login
 * @param {DarkStateProps} props
 */
const SignIn = (props: DarkStateProps) => {
  const UserData = useContext(store);
  const { SetNewData } = UserData;
  const classes = useStyles();

  const [path, setPath] = useState("/");
  const [values, setValues] = useState({
    showPassword: false,
    openAuth: false,
    showModal: false,
    email: "",
    errormsg: "",
    error: false,
    password: "",
    load: false,
  });

  // Funções para mostrar ou não a senha
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const openModal = (showModal: boolean) => {
    setValues({ ...values, showModal });
  };

  // onChange senha ou email
  const onChangeEmailAndPassword = (value: any, type?: boolean) => {
    type
      ? setValues({ ...values, email: value })
      : setValues({ ...values, password: value });
  };

  //Entrar no sistema
  const signIn = () => {
    setValues({ ...values, load: true });
    const path = localStorage.getItem("redirectPathGameland")!;
    setPath(path === "/" ? "/auth" : path);
    AxiosPost("/auth/validate", values)
      .then(({ data }) => {
        setValues({ ...values, load: false, openAuth: true });
        localStorage.setItem("tokenJwtGameland", data.token);
        //Global (seta parâmetros no context)
        SetNewData({ type: "LOGIN_DATA", values: data });
      })
      .catch(({ response }) => {
        localStorage.setItem("tokenJwtGameland", "");
        setValues({
          ...values,
          load: false,
          errormsg: response
            ? response.data.error
            : "Problemas na conexão, tente novamente",
          error: true,
        });
      });
  };

  //Fecha msg
  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setValues({ ...values, error: false });
  };

  return (
    <Grow in={true}>
      <Container component="main" maxWidth="xs">
        {values.openAuth && <Redirect to={path} />}
        <Password openModal={openModal} open={values.showModal} />
        <Snackbar
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          open={values.error}
          onClose={handleClose}
          autoHideDuration={5000}
        >
          <Alert variant="filled" severity={"error"}>
            {values.errormsg}
          </Alert>
        </Snackbar>
        <div className={classes.paper}>
          <img src={logo} alt="gameland.io" />
          <Typography component="h1" variant="h5">
            Entrar no Gameland.io
          </Typography>

          <form className={classes.form} noValidate>
            <TextField
              disabled={values.load}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email ou username"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={({ target }) =>
                onChangeEmailAndPassword(target.value, true)
              }
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              onKeyPress={({ charCode }) =>
                charCode === 13 && !values.load && signIn()
              }
              fullWidth
              disabled={values.load}
              name="password"
              label="Senha"
              type={values.showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              }}
              onChange={({ target }) => onChangeEmailAndPassword(target.value)}
            />
            <FormControlLabel
              control={
                <Checkbox
                  onChange={({ target }) =>
                    localStorage.setItem(
                      "keepConnectedGameland",
                      String(target.checked)
                    )
                  }
                  icon={<LockOpen />}
                  checkedIcon={<Lock />}
                  value="remember"
                  color="primary"
                />
              }
              label="Continuar conectado?"
            />
            <Button
              type="button"
              fullWidth
              disabled={values.load}
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={signIn}
              endIcon={
                values.load ? <CircularProgress size={20} /> : <VpnKey />
              }
            >
              Entrar
            </Button>
            <Grid container>
              <Grid item xs>
                <Link
                  href="#"
                  color="textSecondary"
                  variant="body2"
                  onClick={() => openModal(true)}
                >
                  Esqueceu a senha?
                </Link>
              </Grid>
              <Grid item>
                <LinkRouter to={"/signup"} className={classes.linkSignUp}>
                  Não tem conta ainda? Cadastre-se!
                </LinkRouter>
              </Grid>
            </Grid>
          </form>
        </div>
        <Box mt={5} mb={5}>
          <Copyright {...props} />
        </Box>
      </Container>
    </Grow>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
  linkSignUp: {
    color: theme.palette.primary.main,
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    marginTop: theme.spacing(2),
  },
  form: {
    width: "100%",
    margin: theme.spacing(1, 0, 1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default SignIn;
