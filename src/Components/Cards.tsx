import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { ProductData } from "../react-app-env";
import {
  IconButton,
  Tooltip,
  Chip,
  Divider,
  CardHeader,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from "@material-ui/core";
import {
  Delete,
  SportsEsports,
  Category,
  MoreVert,
  EmojiEmotions,
  Star,
  Comment,
} from "@material-ui/icons";
import { red, blue, yellow } from "@material-ui/core/colors";
import { store } from "../Store";
import RatingComponent from "./Rating";
import { ShowSnackBarAlert, AxiosDel, Transition } from "../utils";
import EditCard from "../Dashboard/EditCard";
import Notes from "./Notes"

interface Props {
  dataCard: ProductData;
  listAllCards: () => void;
}

/**
 * Cartões do dashboard
 * @param {Props} props
 */
export default function Cards(props: Props) {
  const classes = useStyles();
  //const { dataCard } = props;
  const [dataCard, setdataCard] = useState(props.dataCard);
  const UserData = useContext(store);
  const { dataReducer } = UserData;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [deleteCard, setdelete] = useState(false);
  const [load, setLoad] = useState(false);
  const [msgError, setmsgError] = useState({
    msg: "",
    error: false,
    type: false,
  });
  const [openNotes, setOpenNotes] = useState(false)
  const [openEvaluation, setopenEvaluation] = useState(false);
  const [openEdit, setopenEdit] = useState(false);
  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  //Permissão de excluir é do proprio dono ou de adm/master
  const generalPermission =
    dataCard.user._id === dataReducer.user._id ||
    (dataReducer.user.permission !== 1 && dataReducer.user.permission !== 3);

  //permissão de editar é de master ou do dono
  const editPermission =
    dataCard.user._id === dataReducer.user._id ||
    dataReducer.user.permission === 4;


  const deleteCardFunc = () => {
    setLoad(true);
    AxiosDel("/product/" + dataCard._id)
      .then(({ data }: any) => {
        setmsgError({ msg: data.success, type: true, error: false });
        setLoad(false);
        setdelete(false);
        props.listAllCards();
      })
      .catch(({ response }) => {
        setmsgError({
          msg: response ? response.data.error : "Impossível realizar a ação",
          type: true,
          error: true,
        });
        setLoad(false);
      });
  };

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={Boolean(anchorEl)}
      onClose={() => setAnchorEl(null)}
    >
      <MenuItem
        onClick={() => {
          setopenEdit(true);
          setAnchorEl(null);
        }}
      >
        Editar conteúdo
      </MenuItem>
    </Menu>
  );

  return (
    <>
      {openNotes && <Notes
        openNotes={openNotes}
        dataCard={dataCard}
        setOpenNotes={setOpenNotes}
      />}
      <RatingComponent
        openEvaluation={openEvaluation}
        setdataCard={setdataCard}
        dataCard={dataCard}
        setopenEvaluation={setopenEvaluation}
      />
      <EditCard
        openEdit={openEdit}
        setopenEdit={setopenEdit}
        dataCard={dataCard}
        setdataCard={setdataCard}
      />
      {msgError.type && (
        <ShowSnackBarAlert
          anchorOrigin={["top", "center"]}
          dispatchClose={() => setmsgError({ ...msgError, type: false })}
          openCondition={msgError.type}
          msg={msgError.msg}
          time={5000}
          severity={msgError.error ? "error" : "success"}
        />
      )}
      <Dialog
        open={deleteCard}
        onClose={() => setdelete(false)}
        TransitionComponent={Transition}
        maxWidth="xs"
      >
        <DialogTitle>Deseja realmente deletar o jogo?</DialogTitle>
        <DialogContent>
          <DialogContentText>Essa ação é irreversível</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            disabled={load}
            size="small"
            onClick={() => setdelete(false)}
            color="primary"
          >
            Cancelar
          </Button>
          <Button
            onClick={deleteCardFunc}
            size="small"
            disabled={load}
            variant="contained"
            endIcon={load ? <CircularProgress size={20} /> : <Delete />}
            type="button"
            color="primary"
            autoFocus
          >
            Sim
          </Button>
        </DialogActions>
      </Dialog>
      <Card raised className={classes.root} variant="outlined">
        <CardHeader
          avatar={
            <Avatar aria-label="recipe" className={classes.avatar}>
              {dataCard.user.username[0].toUpperCase()}
            </Avatar>
          }
          title={
            <Typography
              title={dataCard.user.username}
              variant="subtitle2"
              className={classes.titleheader}
            >
              {dataCard.user.username}
            </Typography>
          }
          subheader={
            <Typography
              title={dataCard.user.email}
              variant="subtitle1"
              className={classes.subheader}
            >
              {dataCard.user.email}
            </Typography>
          }
          action={
            editPermission && (
              <IconButton onClick={handleProfileMenuOpen}>
                <MoreVert />
              </IconButton>
            )
          }
        />
        <CardActionArea onClick={() => console.log("talvez abrir modal aqui")}>
          <CardMedia
            className={classes.media}
            image={dataCard.img}
            title={dataCard.title}
            onClick={() => editPermission && setopenEdit(true)}
          />
        </CardActionArea>
        <CardActions style={{justifyContent:'center'}}>
          <Tooltip title={"Avaliar jogo"}>
            <Button
              //disabled={disabled}
              size="small"
              color="inherit"
              onClick={() => setopenEvaluation(true)}
            >
              {dataCard.smilles.toFixed(1)}{" "}
              <EmojiEmotions style={{ color: blue[700] }} />{" "}
              {dataCard.stars.toFixed(1)}{" "}
              <Star style={{ color: yellow.A400 }} />{" "}
              {dataCard.games.toFixed(1)}{" "}
              <SportsEsports style={{ color: "#7d42eb" }} />
            </Button>
          </Tooltip>
          <Tooltip title="Ver e fazer comentários">
            <IconButton
              onClick={()=>setOpenNotes(true)}
            >
              <Comment />
            </IconButton>
          </Tooltip>
          {generalPermission && (
            <Tooltip title="Remover o jogo">
              <IconButton onClick={() => setdelete(true)}>
                <Delete style={{ color: red[400] }} />
              </IconButton>
            </Tooltip>
          )}
        </CardActions>
        <Divider/>
        <CardContent>
          <Typography className={classes.name} variant="h5" component="h2">
            {dataCard.title}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {dataCard.description || "Jogo sem nenhuma descrição"}
          </Typography>
          <br />
          {dataCard.platforms.map((platform, i) => (
            <Chip
            style={{ marginRight: 2, marginBottom:2 }}
              label={platform}
              key={i}
              size="small"
              onDelete={() => console.log("dasi")}
              deleteIcon={<SportsEsports />}
              color="primary"
            />
          ))}
          <Divider style={{ marginTop: 5, marginBottom: 5 }} />
          {dataCard.category.map((cat, i) => (
            <Chip
              style={{ marginRight: 2, marginBottom:2 }}
              label={cat}
              key={i}
              size="small"
              onDelete={() => console.log("dasi")}
              deleteIcon={<Category />}
              color="secondary"
            />
          ))}
        </CardContent>
        {renderMenu}
      </Card>
    </>
  );
}

const useStyles = makeStyles({
  root: {
    margin: 20,
    maxWidth: 310,
    minWidth: 300,
  },
  media: {
    height: 220,
  },
  avatar: {
    backgroundColor: red[500],
  },
  subheader: {
    whiteSpace: "nowrap",
    maxWidth: 175,
    overflow: "hidden",
    textOverflow: "ellipsis",
    textTransform: "lowercase",
  },
  titleheader: {
    whiteSpace: "nowrap",
    maxWidth: 250,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  name: {
    whiteSpace: "nowrap",
    maxWidth: 250,
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
});
