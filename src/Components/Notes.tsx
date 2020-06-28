import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  TextareaAutosize,
  makeStyles,
  Theme,
  createStyles,
  CircularProgress,
  IconButton,
} from "@material-ui/core";
import { Send } from "@material-ui/icons";
import {
  Transition,
  AxiosPost,
  LottieAnimation,
  AxiosGet,
  ShowSnackBarAlert,
} from "../utils";
import { ProductData } from "../react-app-env";
import NoteList from "./NoteList";

interface NoteProps {
  openNotes: boolean;
  dataCard: ProductData;
  setOpenNotes: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Janela para postar comentários (e respondê-los) nos produtos
 * @param {NoteProps} props
 */

export default function Notes(props: NoteProps) {
  const { dataCard } = props;
  const [load, setLoad] = useState(false);
  const [dataList, setDataList] = useState<any>([]);
  const classes = useStyles();
  const [note, setNote] = useState("");
  const [errorOrSuccess, setErrorOrSuccess] = useState({
    msg: "",
    errorOrSuccess: false,
    type: false,
  });

  const handleClose = () => {
    props.setOpenNotes(false);
  };

  const searchnotes = () => {
    AxiosGet("/note/" + dataCard._id)
      .then((resp: any) => {
        setDataList(resp.data.notes);
        setLoad(false);
      })
      .catch(({ response }: any) => {
        setLoad(false);
      });
  };

  //Inser comentários
  const insertNote = () => {
    setLoad(true);
    AxiosPost("/note/create/" + dataCard._id, { note })
      .then((resp: any) => {
        dataList.push(resp.data.note);
        setDataList(dataList);
        setErrorOrSuccess({
          msg: "Mensagem enviada",
          errorOrSuccess: true,
          type: false,
        });
        setNote("");
        setLoad(false);
      })
      .catch(({ response }: any) => {
        setErrorOrSuccess({
          msg: response
            ? response.data.error
            : "Houve um problema para enviar mensagem",
          errorOrSuccess: true,
          type: true,
        });
        setLoad(false);
      });
  };

  // Busca comentários ao entrar
  useEffect(() => {
    setLoad(true);
    searchnotes();
  }, []);

  return (
    <div>
      {errorOrSuccess.errorOrSuccess && (
        <ShowSnackBarAlert
          anchorOrigin={["top", "center"]}
          dispatchClose={() =>
            setErrorOrSuccess({ ...errorOrSuccess, errorOrSuccess: false })
          }
          openCondition={errorOrSuccess.errorOrSuccess}
          msg={errorOrSuccess.msg}
          time={5000}
          severity={errorOrSuccess.type ? "error" : "success"}
        />
      )}
      <Dialog
        TransitionComponent={Transition}
        open={props.openNotes}
        closeAfterTransition
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Deixe comentários para o produtor deste jogo
          <TextareaAutosize
            onChange={({ target }) => setNote(target.value)}
            disabled={load}
            draggable={false}
            rowsMin={4}
            value={note}
            className={classes.textArea}
            rowsMax={4}
            inputMode={"text"}
            maxLength={144}
            autoFocus
            onKeyPress={({ charCode }) => {
              if (note && charCode === 13) {
                insertNote();
              }
            }}
            aria-label="maximum height"
            placeholder="Faça pequenos comentários de no máximo 144 caracteres"
          />
          <span className={classes.sendBtn}>
            <IconButton
              disabled={!note}
              size="medium"
              color="primary"
              onClick={insertNote}
            >
              {load ? <CircularProgress size={20} /> : <Send />}
            </IconButton>
          </span>
        </DialogTitle>
        <DialogContent>
          {dataList.length === 0 ? (
            <LottieAnimation
              name={"empty"}
              style={{ width: "80%" }}
              text={"Nada aqui ainda. Faça a primeira pergunta"}
            />
          ) : (
            dataList.map((note: any, i: number) => (
              <NoteList
                {...note}
                dataCard={props.dataCard}
                searchnotes={searchnotes}
                key={i}
              />
            ))
          )}
        </DialogContent>
        <DialogActions>
          <Button
            disabled={load}
            size="small"
            onClick={handleClose}
            variant="outlined"
            color="primary"
          >
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textArea: {
      background: theme.palette.background.paper,
      color: theme.palette.getContrastText(theme.palette.background.paper),
      display: "flex",
      width: "100%",
      marginTop: 10,
    },
    sendBtn: {
      marginTop: 5,
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    root: {
      width: "100%",
      maxWidth: "36ch",
      backgroundColor: theme.palette.background.paper,
    },
    inline: {
      display: "inline",
    },
  })
);
