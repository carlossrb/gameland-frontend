import React from "react";
import { LottieAnimation } from "./utils";

/**
 * Page not found
 * @author Carlos Magno
 */
const NotFoundPage: React.FC = () => {
  return (
    <LottieAnimation
      style={{ width: 700, marginTop: 40 }}
      text="Página não encontrada :("
      name="notFound"
    />
  );
};
export default NotFoundPage;
