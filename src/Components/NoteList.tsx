import React, { useContext, useState } from "react";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import { Note, ProductData } from "../react-app-env";
import { red, green } from "@material-ui/core/colors";
import {
  Face,
  SupervisorAccount,
  Business,
  ColorLens,
  Reply,
  Send,
  Cancel,
  Delete,
} from "@material-ui/icons";
import { store } from "../Store";
import {
  IconButton,
  Tooltip,
  TextareaAutosize,
  Collapse,
  CircularProgress,
} from "@material-ui/core";
import { AxiosPut, AxiosDel } from "../utils";

interface NoteListProps extends Note {
  dataCard: ProductData;
  searchnotes: () => void;
}

/**
 * Lista com todos os comentários e respostas correspondentes
 * @param props
 */
const NoteList: React.FC<NoteListProps> = (props) => {
  const { permission, user, note, reply, _id, dataCard } = props; //dados do comentário e do cartão
  const UserData = useContext(store); // dados do usuário logado
  const { dataReducer } = UserData;
  const classes = useStyles();
  const [value, setValue] = useState("");
  const [load, setLoad] = useState(false);
  const [replyUser, setReplyUser] = useState(false);
  const IconNote =
    permission === 1 ? (
      <Face />
    ) : permission === 2 ? (
      <SupervisorAccount />
    ) : permission === 3 ? (
      <Business />
    ) : (
      <ColorLens />
    );
  const IconReply = <Business />;

  // pode remover admin e master, o proprio produtor e o usuário que fez o comentário
  const removePermission =
    dataReducer.user.permission > 1 ||
    user._id === dataReducer.user._id ||
    dataReducer.user._id === dataCard.user._id;

  const onRemove = () => {
    setLoad(true);
    AxiosDel("/note/" + _id)
      .then(() => {
        setLoad(false);
        props.searchnotes();
      })
      .catch(() => {
        setLoad(false);
      });
  };

  const removeNote = (
    <>
      {removePermission && (
        <Tooltip title="Remover comentário">
          <IconButton onClick={onRemove} size="small">
            <Delete style={{ color: red[400] }} />
          </IconButton>
        </Tooltip>
      )}
    </>
  );

  //Resposta do produtor
  const producerResponse = (
    <>
      {reply && (
        <ListItem alignItems="flex-start">
          <ListItemAvatar>
            <Avatar aria-label="recipe" className={classes.avatarReply}>
              {dataCard.user.username[0].toUpperCase()}
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <>
                <span style={{ display: "flex", alignItems: "center" }}>
                  <b>{dataCard.user.username}</b>
                  {IconReply}
                </span>
                <span style={{ display: "flex" }}>{reply}</span>
              </>
            }
          />
        </ListItem>
      )}
    </>
  );

  //Funcção que insere resposta
  const setReply = () => {
    setLoad(true);
    const body = {
      user: user._id,
      reply: value,
      productId: dataCard._id,
    };
    AxiosPut("/note/" + _id, body)
      .then(() => {
        props.searchnotes();
        setLoad(false);
        setValue("");
      })
      .catch(() => {
        setLoad(false);
      });
  };

  const replyNote = (
    <>
      {!reply && (
        <Collapse in={replyUser}>
          <TextareaAutosize
            draggable={false}
            rowsMin={4}
            className={classes.textArea}
            rowsMax={4}
            inputMode={"text"}
            disabled={load}
            onChange={({ target }) => setValue(target.value)}
            value={value}
            maxLength={144}
            autoFocus={replyUser}
            onKeyPress={({ charCode }) => {
              if (note && charCode === 13) {
                setReply();
              }
            }}
            aria-label="maximum height"
            placeholder="Responda com parcimônia"
          />
          <span className={classes.sendBtn}>
            <IconButton
              disabled={load}
              size="small"
              color="default"
              onClick={() => setReplyUser(false)}
            >
              <Cancel />
            </IconButton>
            <IconButton
              disabled={load || !value}
              size="small"
              color="primary"
              onClick={setReply}
            >
              {load ? <CircularProgress size={20} /> : <Send />}
            </IconButton>
          </span>
        </Collapse>
      )}
    </>
  );

  return (
    <List className={classes.root}>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar aria-label="recipe" className={classes.avatar}>
            {user.username[0].toUpperCase()}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={
            <>
              <span style={{ display: "flex", alignItems: "center" }}>
                <b>{user.username}</b>
                {IconNote}
                {removeNote}
              </span>
              <span style={{ display: "flex", alignItems: "center" }}>
                {note}
                {!reply && dataReducer.user._id === dataCard.user._id && (
                  <Tooltip title="Responder">
                    <IconButton
                      onClick={() => {
                        setReplyUser(true);
                      }}
                      size="small"
                    >
                      <Reply />
                    </IconButton>
                  </Tooltip>
                )}
              </span>
            </>
          }
          secondary={producerResponse}
        />
      </ListItem>
      <Divider variant="inset" component="li" />
      {replyNote}
    </List>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: "100%",
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: "inline",
    },
    sendBtn: {
      marginTop: 5,
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    avatar: {
      backgroundColor: green[500],
    },
    avatarReply: {
      backgroundColor: red[500],
    },
    textArea: {
      background: theme.palette.background.paper,
      color: theme.palette.getContrastText(theme.palette.background.paper),
      display: "flex",
      width: "100%",
    },
  })
);

export default NoteList;
