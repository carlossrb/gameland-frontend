import React from "react";
import Box from "@material-ui/core/Box";
import Container from "@material-ui/core/Container";
import { LottieAnimation } from "../utils";
import TopBar from "../Components/TopBar"
import { DarkStateProps } from "../Auth/Copyright";
import AddCards from "../Components/AddCard";
import { Fab, makeStyles, Theme, createStyles } from "@material-ui/core";
import { Clear } from "@material-ui/icons";

const Auth: React.FC <DarkStateProps>= (props) => {
  const style = useStyles()

  return (
    <React.Fragment>
      <Container>
        <Box my={2}>
        <TopBar {...props}/>
        <Fab variant="extended" size="small" color="secondary" className={style.fabStyle}>
          <Clear />
          Limpar filtros
        </Fab>
          <LottieAnimation
            style={{ width: 450, marginTop: 40 }}
            text="Nada para exibir :("
            speed={0.8}
            name="pacman"
          />
        <AddCards/>
        </Box>
      </Container>
    </React.Fragment>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fabStyle: {
      position: "absolute",
      top: theme.spacing(10),
      right: theme.spacing(2),
    },
  }),
);

export default Auth;
