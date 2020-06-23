import React, { useState } from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { LottieAnimation, AxiosGet, ShowSnackBarAlert } from "../utils";
import TopBar from "../Components/TopBar";
import AddCards from "../Components/AddCard";
import { Fab, makeStyles, Theme, createStyles } from "@material-ui/core";
import { Clear } from "@material-ui/icons";
import { ProductData, DarkStateProps } from "../react-app-env";

const Auth: React.FC<DarkStateProps> = (props) => {
  const style = useStyles();
  const [dataCards, setdataCards] = useState<Array<ProductData>>([]);
  const [listMsg, setListMsg] = useState({
    msg: "",
    error: false,
    type: false,
  });

  const listAllCards = () => {
    AxiosGet("/product/")
      .then((dataCards: any) => {
        setdataCards(dataCards);
        setListMsg({ msg: "tudo ok", error: false, type: false });
      })
      .catch(({ response }) => {
        setListMsg({
          msg: response
            ? response.error
            : "Houve um pequeno erro, tente novamente!",
          error: false,
          type: true,
        });
      });
  };

  return (
    <Container>
      {listMsg.error && (
        <ShowSnackBarAlert
          anchorOrigin={["top", "right"]}
          dispatchClose={() => setListMsg({ ...listMsg, error: false })}
          msg={listMsg.msg}
          openCondition={listMsg.error}
          time={5000}
          severity={listMsg.type ? "error" : "success"}
        />
      )}
      <Box my={2}>
        <TopBar {...props} />
        <Fab
          onClick={listAllCards}
          variant="extended"
          size="small"
          color="secondary"
          className={style.fabStyle}
        >
          <Clear />
          Limpar filtros
        </Fab>
        <LottieAnimation
          style={{ width: 450, marginTop: 40 }}
          text="Nada para exibir :("
          speed={0.8}
          name="pacman"
        />
        <AddCards />
      </Box>
    </Container>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fabStyle: {
      position: "absolute",
      top: theme.spacing(10),
      right: theme.spacing(2),
    },
  })
);

export default Auth;
