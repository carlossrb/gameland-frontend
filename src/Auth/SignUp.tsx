import React, { useState, useEffect, useContext } from "react";
import { Redirect } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Button,
  IconButton,
  TextField,
  CircularProgress,
  InputAdornment,
  FormControlLabel,
  Checkbox,
  Collapse,
  Slide,
} from "@material-ui/core";
import { makeStyles, Theme } from "@material-ui/core/styles";
import logo from "../Auth/gameland.io.png";
import {
  Visibility,
  VisibilityOff,
  SportsEsports,
  CheckCircleOutline,
  Work,
  SportsEsportsOutlined,
} from "@material-ui/icons";
import { AxiosPost, validateEmail, ShowSnackBarAlert } from "../utils/index";
import PasswordStrengthBar from "react-password-strength-bar";
import { green } from "@material-ui/core/colors";
import Copyright from "./Copyright";
import { store } from "../Store";
import { DarkStateProps } from "../react-app-env";

interface State {
  username: string;
  checked: boolean;
  openAuth: boolean;
  showPassword: boolean;
  email: string;
  errormsg: string;
  error: boolean;
  password: string;
  load: boolean;
  cnpj: string;
}
/**
 * Tela principal de login
 * @param {DarkStateProps} props
 */
const SignUp = (props: DarkStateProps) => {
  const classes = useStyles();
  const UserData = useContext(store);
  const { SetNewData } = UserData;

  const [values, setValues] = useState<State>({
    username: "",
    checked: false,
    openAuth: false,
    showPassword: false,
    email: "",
    errormsg: "",
    error: false,
    password: "",
    load: false,
    cnpj: "",
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

  /**
   *
   * @param value target values
   * @param type 1 - email, 2 - username, 3 - senha, 4...
   */
  const onChangeEmailAndPassword = (value: any, type: number) => {
    switch (type) {
      case 1:
        setValues({ ...values, email: value });
        break;
      case 2:
        setValues({ ...values, username: value });
        break;
      case 3:
        setValues({ ...values, password: value });
        break;
      default:
        {
          let { cnpj } = values;
          const regex = /^[0-9]*$/;
          setValues({ ...values, cnpj: regex.test(value) ? value : cnpj });
        }
        break;
    }
  };

  //Entrar e cadastrar no sistema
  const signUp = () => {
    setValues({ ...values, load: true });
    AxiosPost("/auth/register", values)
      .then(({ data }: any) => {
        setValues({ ...values, load: false, openAuth: true });
        localStorage.setItem("tokenJwtGameland", data.token);
        localStorage.setItem("keepConnectedGameland", "false");
        //Global (seta parâmetros no context)
        SetNewData({ type: "LOGIN_DATA", values: data });
      })
      .catch(({ response }) => {
        setValues({
          ...values,
          load: false,
          errormsg: response
            ? response.data.error
            : "Problemas de conexão, tente novamente",
          error: true,
        });
      });
  };

  useEffect(() => {
    localStorage.setItem("redirectPathGameland", "/");
  }, []);

  return (
    <Slide direction="left" in={true} mountOnEnter unmountOnExit>
      <Container component="main" maxWidth="xs">
        {values.openAuth && <Redirect to={"/auth"} />}
        {values.error && (
          <ShowSnackBarAlert
            msg={values.errormsg}
            anchorOrigin={["top", "center"]}
            dispatchClose={() => setValues({ ...values, error: false })}
            openCondition={values.error}
            severity={"error"}
            time={5000}
          />
        )}
        <div className={classes.paper}>
          <img src={logo} alt="gameland.io" />
          <Typography component="h1" variant="h5">
            Cadastre-se no Gameland.io
          </Typography>

          <form className={classes.form} noValidate>
            <TextField
              size="small"
              disabled={values.load}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              helperText={
                !validateEmail(values.email) ? "Digite um email válido" : ""
              }
              id="email"
              label="Email"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={({ target }) =>
                onChangeEmailAndPassword(target.value, 1)
              }
              InputProps={{
                endAdornment: validateEmail(values.email) && (
                  <InputAdornment position="end">
                    <CheckCircleOutline
                      style={{ color: green[400] }}
                      fontSize="small"
                    />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              size="small"
              disabled={values.load}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="Nome de usuário"
              name="username"
              onChange={({ target }) =>
                onChangeEmailAndPassword(target.value, 2)
              }
            />
            <TextField
              size="small"
              helperText={
                values.password.length < 6
                  ? "A senha deve ter no mínimo 6 caracteres"
                  : ""
              }
              variant="outlined"
              margin="normal"
              required
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
                    size="small"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                ),
              }}
              onChange={({ target }) =>
                onChangeEmailAndPassword(target.value, 3)
              }
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
              password={values.password}
            />
            <Collapse in={values.checked}>
              <TextField
                size="small"
                disabled={values.load}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                value={values.cnpj}
                id="cnpj"
                label="CNPJ/CPF"
                name="number"
                autoFocus={values.checked}
                onChange={({ target }) =>
                  onChangeEmailAndPassword(target.value, 4)
                }
                InputProps={{
                  endAdornment: (values.cnpj.length === 11 ||
                    values.cnpj.length === 14) && (
                    <InputAdornment position="end">
                      <CheckCircleOutline
                        style={{ color: green[400] }}
                        fontSize="small"
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Collapse>

            <FormControlLabel
              control={
                <Checkbox
                  onChange={({ target }) =>
                    setValues({ ...values, checked: target.checked })
                  }
                  checkedIcon={<Work />}
                  icon={<SportsEsportsOutlined />}
                  value="remember"
                  color="primary"
                />
              }
              label="Criador de jogos?"
            />
            <Button
              type="button"
              fullWidth
              disabled={
                values.load ||
                !validateEmail(values.email) ||
                values.password.length < 6 ||
                values.username.length < 1 ||
                (!(values.cnpj.length === 11 || values.cnpj.length === 14) &&
                  values.checked)
              }
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={signUp}
              endIcon={
                values.load ? (
                  <CircularProgress size={20} />
                ) : values.checked ? (
                  <Work />
                ) : (
                  <SportsEsports />
                )
              }
            >
              Cadastrar
            </Button>
          </form>
        </div>
        <Box mt={5} mb={5}>
          <Copyright {...props} />
        </Box>
      </Container>
    </Slide>
  );
};

const useStyles = makeStyles((theme: Theme) => ({
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

export default SignUp;
