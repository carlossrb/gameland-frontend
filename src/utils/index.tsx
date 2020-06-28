import API from "./API";
import React, { useEffect, CSSProperties } from "react";
import Lottie from "lottie-web";
import {
  Snackbar,
  makeStyles,
  Theme,
  createStyles,
  Backdrop,
  CircularProgress,
  Typography,
  Slide
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { TransitionProps } from "@material-ui/core/transitions";

/**
 * Validar email
 * @param {*} email
 */
const validateEmail = (email: string) => {
  const reg = /^\w+([.-]\w+)*@\w+([.-]\w+)*\.\w{1,}$/;
  return reg.test(email);
};

/**
 * Obtém as requisiçoes get
 * @param {string} adress endpoint da requisição
 */
const AxiosGet = async (adress: string) => {
  API.defaults.headers = {
    authorization: "Bearer " + localStorage.getItem("tokenJwtGameland"),
  };
  return await API.get(adress).then((res) => res);
};

/**
 * Requisição de delete
 * @param {string} adress endpoint da requisição
 */
const AxiosDel = async (adress: string) => {
  API.defaults.headers = {
    authorization: "Bearer " + localStorage.getItem("tokenJwtGameland"),
  };
  return await API.delete(adress).then((res) => res);
};

/**
 * Obtém as requisiçoes post
 * @param {string} adress endpoint da requisição
 * @param {object} body parâmetros
 */
const AxiosPost = async (adress: string, body: {} = {}) => {
  API.defaults.headers = {
    authorization: "Bearer " + localStorage.getItem("tokenJwtGameland"),
  };
  return await API.post(adress, body).then((res) => res);
};

/**
 * Obtém as requisiçoes put
 * @param {string} adress endpoint da requisição
 * @param {object} body parâmetros
 */
const AxiosPut = async (adress: string, body: {} = {}) => {
  API.defaults.headers = {
    authorization: "Bearer " + localStorage.getItem("tokenJwtGameland"),
  };
  return await API.put(adress, body).then((res) => res);
};

// Transições para os alerts
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface PropsSnackBar {
  dispatchClose: () => void;
  openCondition: boolean;
  time: number;
  anchorOrigin: ["top" | "bottom", "left" | "center" | "right"];
  msg: string;
  severity?: "info" | "success" | "warning" | "error";
}
/**
 * Mostra pequenas mensagens coloridas na tela para informação
 * @param props 
 */
const ShowSnackBarAlert: React.FC<PropsSnackBar> = (props) => {
  const {
    dispatchClose,
    openCondition,
    severity,
    time,
    msg,
    anchorOrigin,
  } = props;

  const handleClose = (
    event: React.SyntheticEvent | React.MouseEvent,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    dispatchClose();
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: anchorOrigin[0],
        horizontal: anchorOrigin[1],
      }}
      open={openCondition}
      onClose={handleClose}
      autoHideDuration={time}
    >
      <Alert variant="filled" severity={severity}>
        {msg}
      </Alert>
    </Snackbar>
  );
};

interface BlacdropProps {
  color?: string;
  open: boolean;
}
/**
 * Load circular com fundo negro
 * @param props 
 */
const ShowBlackDrop: React.FC<BlacdropProps> = (props) => {
  const classes = useStyles("#fff");

  return (
    <Backdrop className={classes.backdrop} open={props.open}>
      <CircularProgress color="inherit" />
      <Typography variant="h6">Aguarde...</Typography>
    </Backdrop>
  );
};

interface Props {
  name: string;
  style?: CSSProperties;
  text?: string;
  speed?: number;
}
/**
 * Render lottie animations
 * @param {Props} props
 */
const LottieAnimation: React.FC<Props> = (props) => {
  let ref: any = null;

  useEffect(() => {
    loadAnimation();
  }, []);

  const loadAnimation = () => {
    Lottie.loadAnimation({
      container: ref, // the dom element that will contain the animation
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: require("../Animation/" + props.name + ".json"),
    }).setSpeed(props.speed || 1);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <div style={props.style} ref={(rf) => (ref = rf)} />
      {props.text && <h3>{props.text}</h3>}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: (color: string) => color,
    },
  })
);

export {
  validateEmail,
  AxiosGet,
  AxiosPost,
  ShowBlackDrop,
  LottieAnimation,
  ShowSnackBarAlert,
  Transition,
  AxiosDel,
  AxiosPut
};
