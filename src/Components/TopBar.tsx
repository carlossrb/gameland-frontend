import React, { useContext, useState } from "react";
import clsx from "clsx";
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme,
} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import { store } from "../Store";
import { Menu, MenuItem, Chip, Tooltip } from "@material-ui/core";
import {
  AccountCircle,
  SportsEsports,
  Work,
  Face,
  SupervisorAccount,
  Business,
  ColorLens,
} from "@material-ui/icons";
import MenuDrawer from "./Menu";
import { Redirect } from "react-router-dom";
import Path from "../Routes/Paths.json";
import { DarkStateProps, DarkMode } from "../Auth/Copyright";

// largura do menu aberto
const drawerWidth = 210;

const TopBar: React.FC<DarkStateProps> = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const UserData = useContext(store);
  const { NewData } = UserData;
  const { permission } = NewData.user;
  const [logout, setLogout] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={"primary-search-account-menu"}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
    >
      <MenuItem onClick={(value) => handleMenuItemClick(value, 1)}>
        Sair
      </MenuItem>
    </Menu>
  );

  const handleMenuItemClick = (
    value: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    //Remove o manter contectado e o token e direciona pro login, assim o usuário não pode ficar logado
    if (index === 1) {
      localStorage.setItem("tokenJwtGameland", "");
      localStorage.setItem("keepConnectedGameland", "false");
      setLogout(true);
    }

    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={() => setOpen(true)}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            {permission > 2 ? <Work /> : <SportsEsports />}
          </IconButton>
          <DarkMode
            {...props}
            size="medium"
            color={theme.palette.primary.contrastText}
          />

          <div className={classes.grow} />
          <Typography
            className={classes.title}
            variant="h6"
            noWrap
          ></Typography>
          <Typography className={classes.title} variant="h6" noWrap>
            {NewData.user.username}
          </Typography>
          <Tooltip title="Tipo de conta" aria-label="add">
            <Chip
              label={
                permission === 1
                  ? <Typography variant="subtitle1">Jogador</Typography>
                  : permission === 2
                  ? <Typography variant="subtitle1">Admin</Typography>
                  : permission === 3
                  ? <Typography variant="subtitle2" noWrap>Produtor</Typography>
                  : <Typography variant="subtitle1">MasterAccount</Typography>
              }
              style={{marginLeft:10}}
              color="secondary"
              icon={
                permission === 1 ? (
                  <Face />
                ) : permission === 2 ? (
                  <SupervisorAccount />
                ) : permission === 3 ? (
                  <Business />
                ) : (
                  <ColorLens />
                )
              }
            />
          </Tooltip>
          <div className={classes.sectionDesktop}>
            <IconButton
              edge="end"
              aria-label="account of current user"
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              <AccountCircle />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <MenuDrawer drawerWidth={drawerWidth} open={open} setOpen={setOpen} />
      {logout && <Redirect to={Path.SignIn} />}
      {renderMenu}
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    grow: {
      flexGrow: 1,
    },
    sectionDesktop: {
      display: "none",
      [theme.breakpoints.up("md")]: {
        display: "flex",
      },
    },
    title: {
      display: "none",
      [theme.breakpoints.up("sm")]: {
        display: "block",
      },
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: "none",
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

export default TopBar;
