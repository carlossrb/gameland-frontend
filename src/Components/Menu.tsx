import React, { useContext, useState, useEffect } from "react";
import clsx from "clsx";
import {
  createStyles,
  makeStyles,
  useTheme,
  Theme,
} from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import {
  AllInclusive,
  ChevronLeft,
  ChevronRight,
  VideogameAsset,
} from "@material-ui/icons";
import { store } from "../Store";
import { MenuProps } from "../react-app-env";

/**
 * Menu lateral do sistema
 * @param {Props} props
 */
const MenuDrawer: React.FC<MenuProps> = (props) => {
  const classes = useStyles(props.drawerWidth);
  const theme = useTheme();
  const { open, setOpen } = props;
  const UserData = useContext(store);
  const { dataReducer } = UserData;
  const [selected, setSelected] = useState(false);
  const setDataFilter = props.dataCardsFilter[1];
  const data = props.dataCards;

  const dataFilterFunc = (item: boolean) => {
    const { _id } = dataReducer.user;
    setSelected(item);
    if (item) {
      let dataAux = data.filter((data) => data.user._id === _id);
      setDataFilter(dataAux);
    } else setDataFilter(data);
  };

  useEffect(() => {
    dataFilterFunc(selected);
  }, [data]);

  return (
    <Drawer
      variant="permanent"
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      <div className={classes.toolbar}>
        <IconButton
          onClick={() => {
            props.setOpenIndex(false);
            setOpen(false);
          }}
        >
          {theme.direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </div>
      <Divider />
      <List>
        <ListItem
          selected={!selected}
          onClick={() => dataFilterFunc(false)}
          button
          key={"Todos os jogos"}
        >
          <ListItemIcon className={classes.drawCloseIcon}>
            <AllInclusive />
          </ListItemIcon>
          <ListItemText primary={"Todos os jogos"} />
        </ListItem>
        {dataReducer.user.permission === 3 && (
          <ListItem
            selected={selected}
            onClick={() => dataFilterFunc(true)}
            button
            key={"Seus jogos"}
          >
            <ListItemIcon className={classes.drawCloseIcon}>
              <VideogameAsset />
            </ListItemIcon>
            <ListItemText primary={"Seus jogos"} />
          </ListItem>
        )}
      </List>
    </Drawer>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: (width: number) => width,
      flexShrink: 0,
      whiteSpace: "nowrap",
    },
    drawerOpen: {
      width: (width: number) => width,
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawCloseIcon: {
      paddingLeft: theme.spacing(1),
    },
    drawerClose: {
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: "hidden",
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    },
    toolbar: {
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
  })
);

export default MenuDrawer;
