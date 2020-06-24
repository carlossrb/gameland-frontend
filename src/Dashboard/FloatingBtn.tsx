import React, { useState, useContext } from "react";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import FilterListIcon from "@material-ui/icons/FilterList";
import SearchIcon from "@material-ui/icons/Search";
import GameIcon from "@material-ui/icons/Games";
import { store } from "../Store";
import AddNewGame from "./AddNewGame";
import Filter from "./Filter";
import SearchGame from "./Search";
import { PropsAddCard } from "../react-app-env";

export default function FloatingBtn(props: PropsAddCard) {
  let actions = [
    { icon: <FilterListIcon />, name: "Filtrar" },
    { icon: <SearchIcon />, name: "Buscar" },
    { icon: <AddCircleOutlineIcon />, name: "Novo jogo" },
  ];

  const classes = useStyles();
  const UserData = useContext(store);
  const { dataReducer } = UserData;
  const [open, setOpen] = useState(false);
  const [dialogs, setOpenDialogs] = useState({
    openSearch: false,
    openFilter: false,
    openNewGame: false,
  });

  if (dataReducer.user.permission !== 3) actions.pop()

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const openDialog = (name: string) => {
    if (name === "Novo jogo") setOpenDialogs({ ...dialogs, openNewGame: true });
    else if (name=== "Filtrar") setOpenDialogs({ ...dialogs, openFilter: true });
    else setOpenDialogs({ ...dialogs, openSearch: true });
  };

  return (
    <>
      <AddNewGame {...props} open={dialogs} setOpen={setOpenDialogs} />
      <Filter {...props} open={dialogs} setOpen={setOpenDialogs} />
      <SearchGame {...props} open={dialogs} setOpen={setOpenDialogs} />
      <SpeedDial
        ariaLabel="SpeedDial example"
        className={classes.speedDial}
        hidden={false}
        icon={<GameIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        direction={"up"}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={() => openDialog(action.name)}
          />
        ))}
      </SpeedDial>
    </>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    speedDial: {
      position: "fixed",
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
  })
);
