import React, { useState, useEffect } from "react";
import { LottieAnimation, ShowSnackBarAlert, AxiosPost } from "../utils";
import TopBar from "../Components/TopBar";
import FloatingBtn from "./FloatingBtn";
import {
  Fab,
  makeStyles,
  Theme,
  createStyles,
  Grow,
  GridList,
} from "@material-ui/core";
import { Clear, Refresh } from "@material-ui/icons";
import { ProductData, DarkStateProps, ActiveFilter } from "../react-app-env";
import Cards from "../Components/Cards";
import clsx from "clsx";

// largura do menu aberto
const drawerWidth = 210;

/**
 * Principal componente do dashboard (chama função de carregamento dos cards)
 * @param {DarkStateProps} props 
 */
const Auth: React.FC<DarkStateProps> = (props) => {
  const style = useStyles();
  const [open, setOpen] = useState(false);
  const [dataCards, setdataCards] = useState<Array<ProductData>>([]);
  const [dataCardsFilter, setdataCardsFilter] = useState<Array<ProductData>>(
    []
  );
  const [listMsg, setListMsg] = useState({
    msg: "",
    error: false,
    type: false,
  });
  // filtros para busca
  const [activeFilter, setActiveFilter] = useState<ActiveFilter>({
    search: "",
    category: [],
    platform: [],
  });

  let clearOrRefresh =
    activeFilter.category.length > 0 ||
    activeFilter.platform.length > 0 ||
    activeFilter.search;

  //Busca todos os cards ao abrir o dash (e ao mudar os filtros)
  useEffect(() => {
    listAllCards();
  }, [activeFilter]);


  // Lista todos os cards do dash
  const listAllCards = () => {
    AxiosPost("/product/list", { activeFilter })
      .then(({ data }: any) => {
        setdataCards(data.products);
        setListMsg({ msg: "tudo ok", error: false, type: false });
      })
      .catch(({ response }) => {
        setListMsg({
          msg: response
            ? response.data.error
            : "Houve um pequeno erro, tente novamente!",
          error: false,
          type: true,
        });
      });
  };

  return (
    <>
      <TopBar
        {...props}
        dataCardsFilter={[dataCardsFilter, setdataCardsFilter]}
        dataCards={dataCards}
        setOpen={setOpen}
        drawerWidth={drawerWidth}
      />
      <div
        className={clsx(style.content, {
          [style.contentShift]: open,
        })}
      >
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
        {!listMsg.type && (
          <Fab
            onClick={() =>
              setActiveFilter({ platform: [], category: [], search: "" })
            }
            variant="extended"
            size="small"
            color={clearOrRefresh ? "primary" : "secondary"}
            className={style.fabStyleRefresh}
          >
            {clearOrRefresh ? <Clear /> : <Refresh />}
            {clearOrRefresh ? "Limpar todos os filtros" : "Recarregar Cards"}
          </Fab>
        )}

        {dataCardsFilter.length === 0 ? (
          <LottieAnimation
            style={{ width: 450, marginTop: 40 }}
            text="Nada para exibir :("
            speed={0.8}
            name="pacman"
          />
        ) : (
          <GridList cellHeight={"auto"} className={style.gridList} cols={3}>
            {dataCardsFilter.map((dataCard: ProductData) => (
              <Grow in={true}>
                <Cards listAllCards={listAllCards} dataCard={dataCard} />
              </Grow>
            ))}
          </GridList>
        )}
        <FloatingBtn
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          listAllCards={listAllCards}
        />
      </div>
    </>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fabStyleRefresh: {
      position: "fixed",
      top: theme.spacing(9),
      right: theme.spacing(6),
      zIndex: 1,
    },
    content: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: theme.spacing(7),
      marginTop: theme.spacing(8.5),
    },
    contentShift: {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: drawerWidth,
    },
    gridList: {
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "center",
      overflow: "hidden",
    },
  })
);

export default Auth;
