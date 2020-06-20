import API from "./API";
import React, { useEffect, CSSProperties } from "react";
import Lottie from "lottie-web";

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
 * @param {object} body parâmetros
 */
const AxiosGet = async (adress: string, body: {} = {}) => {
  API.defaults.headers = {
    authorization: "Bearer " + localStorage.getItem("tokenJwtGameland"),
  };
  return await API.get(adress, body).then((res) => res);
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

interface Props {
  name: string;
  style?: CSSProperties;
  text?: string;
  speed?: number
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
      <div style={props.style} ref={(rf) => (ref = rf)}/>
        {props.text && <h3>{props.text}</h3>}
    </div>
  );
};

export { validateEmail, AxiosGet, AxiosPost, LottieAnimation };
