import React, { useContext } from "react";
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

interface Props {
  drawerWidth: number;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MenuDrawer: React.FC<Props> = (props) => {
  const classes = useStyles(props.drawerWidth);
  const theme = useTheme();
  const { open, setOpen } = props;
  const UserData = useContext(store);
  const { NewData } = UserData;

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
        <IconButton onClick={() => setOpen(false)}>
          {theme.direction === "rtl" ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </div>
      <Divider />
      <List>
        <ListItem button key={"Todos os jogos"}>
          <ListItemIcon className={classes.drawCloseIcon}>
            <AllInclusive />
          </ListItemIcon>
          <ListItemText primary={"Todos os jogos"} />
        </ListItem>
        {NewData.user.permission > 2 && (
          <ListItem button key={"Seus jogos"}>
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
