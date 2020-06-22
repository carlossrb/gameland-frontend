import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";


export interface PropsAddCard{
    open: {
        openSearch: boolean;
        openFilter: boolean;
        openNewGame: boolean;
    }
    setOpen: React.Dispatch<React.SetStateAction<{
        openSearch: boolean;
        openFilter: boolean;
        openNewGame: boolean;
    }>>
}

export default function AddNewGame(props:PropsAddCard) {


  const handleClose = () => {
    props.setOpen({...props.open,openNewGame:false});
  };

  return (
    <div>
      <Dialog
        open={props.open.openNewGame}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Adicionar novo jogo"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending
            anonymous location data to Google, even when no apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={handleClose} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
