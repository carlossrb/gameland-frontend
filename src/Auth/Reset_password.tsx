import React, { useState, useEffect, useContext } from "react";
import { RouteComponentProps, Redirect } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  Slide,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import logo from "../Auth/gameland.io.png";
import { Visibility, VisibilityOff, Send } from "@material-ui/icons";
import { AxiosGet, AxiosPost, ShowSnackBarAlert } from "../utils/index";
import PasswordStrengthBar from "react-password-strength-bar";
import { store } from "../Store";

interface Props extends RouteComponentProps {
  match: any;
}

interface State {
  showPassword: boolean;
  email: string;
  newPassword: string;
  token: string;
}

/**
 * Abre página de redefinição de senha
 * @param {Props} props
 */
const ResetPassword: React.FC<Props> = (props) => {
  const UserData = useContext(store);
  const { SetNewData } = UserData;

  const classes = useStyles();
  const [tokenEnableLoads, setToken] = useState({
    resetPasswordLoad: false,
    error: false,
    errormsg: "",
    tokenLoad: false,
    emailDisable: true,
    redirect: false,
  });
  const [values, setValues] = useState<State>({
    showPassword: false,
    email: "",
    newPassword: "",
    token: "",
  });

  //Abertura da página
  useEffect(() => {
    localStorage.setItem("redirectPathGameland", "/");
    const { token } = props.match.params;
    if (!token) setToken({ ...tokenEnableLoads, tokenLoad: true });
    AxiosGet("/auth/reset/" + token)
      .then((res: any) => {
        if (res.data.email) {
          localStorage.setItem("keepConnectedGameland", "false");
          setValues({ ...values, email: res.data.email, token });
          setToken({
            ...tokenEnableLoads,
            tokenLoad: false,
            emailDisable: false,
          });
        }
      })
      .catch(() => {
        setToken({
          ...tokenEnableLoads,
          emailDisable: false,
          error: true,
          errormsg:
            "Link expirado ou inválido. Você será redirecionado para a página de login",
        });
        // atrasa um pouco o redirecionamento para exibir o problema em questão
        Promise.resolve()
          .then(timeout(4500))
          .then(() => setToken({ ...tokenEnableLoads, tokenLoad: true }));
      });
  }, []);

  const ResetPassword = () => {
    setToken({ ...tokenEnableLoads, resetPasswordLoad: true });
    AxiosPost("/auth/reset_password", values)
      .then(({ data }) => {
        localStorage.setItem("tokenJwtGameland", data.token);
        localStorage.setItem("keepConnectedGameland", "false");
        setToken({
          ...tokenEnableLoads,
          resetPasswordLoad: false,
          redirect: true,
        });
        //Global (seta parâmetros no context)
        SetNewData({ type: "LOGIN_DATA", values: data });
      })
      .catch(({ response }) => {
        localStorage.setItem("tokenJwtGameland", "");
        setToken({
          ...tokenEnableLoads,
          resetPasswordLoad: false,
          error: response
            ? response.data.error
            : "Problemas de conexão, tente novamente",
        });
      });
  };

  // Funções para mostrar ou não a senha
  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  // Agenda execução para tempo (ms)
  function timeout(ms: number) {
    return () => new Promise((resolve) => setTimeout(resolve, ms));
  }

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  // onChange senha ou email
  const onChangeEmailAndPassword = (value: any) => {
    setValues({ ...values, newPassword: value });
  };

  return (
    <Slide direction="left" in={true} mountOnEnter unmountOnExit>
      <Container component="main" maxWidth="xs">
        {tokenEnableLoads.error && (
          <ShowSnackBarAlert
            msg={tokenEnableLoads.errormsg}
            anchorOrigin={["top", "right"]}
            dispatchClose={() =>
              setToken({ ...tokenEnableLoads, error: false })
            }
            openCondition={tokenEnableLoads.error}
            severity={"error"}
            time={5000}
          />
        )}
        {tokenEnableLoads.tokenLoad && <Redirect to={"/"} />}
        {tokenEnableLoads.redirect && <Redirect to={"/auth"} />}
        <div className={classes.paper}>
          <img src={logo} alt="gameland.io" />
          <Typography component="h1" variant="h5">
            Redefina sua senha
          </Typography>

          <form className={classes.form} noValidate>
            <TextField
              disabled={true}
              value={values.email}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              InputProps={{
                endAdornment: tokenEnableLoads.emailDisable && (
                  <CircularProgress size={30} />
                ),
              }}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              value={values.newPassword}
              fullWidth
              name="password"
              label="Nova senha"
              onKeyPress={({ charCode }) => {
                if (
                  !(
                    tokenEnableLoads.emailDisable ||
                    values.newPassword.length < 6 ||
                    values.email.length === 0 ||
                    tokenEnableLoads.resetPasswordLoad
                  ) &&
                  charCode === 13
                )
                  ResetPassword();
              }}
              type={values.showPassword ? "text" : "password"}
              id="password"
              autoFocus
              disabled={values.email.length === 0}
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
              onChange={({ target }) => {
                onChangeEmailAndPassword(target.value);
              }}
            />
            <PasswordStrengthBar
              shortScoreWord=""
              scoreWords={[
                "bem ruim 🥴",
                "fraco 😬",
                "legalzinho 🙂",
                "massa 🤗",
                "show de bola 🤩",
              ]}
              password={values.newPassword}
            />
            <Button
              type="button"
              fullWidth
              disabled={
                tokenEnableLoads.emailDisable ||
                values.newPassword.length < 6 ||
                values.email.length === 0 ||
                tokenEnableLoads.resetPasswordLoad
              }
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={ResetPassword}
              endIcon={
                tokenEnableLoads.resetPasswordLoad ? (
                  <CircularProgress size={20} />
                ) : (
                  <Send />
                )
              }
            >
              {tokenEnableLoads.resetPasswordLoad
                ? "Alterando..."
                : "Alterar e entrar"}
            </Button>
          </form>
        </div>
      </Container>
    </Slide>
  );
};

const useStyles = makeStyles((theme) => ({
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  form: {
    width: "100%",
    margin: theme.spacing(1, 0, 1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default ResetPassword;
