import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { TextField } from "@material-ui/core";
import { Send } from "@material-ui/icons";
import { Transition } from "../utils";
import { PropsAddCard } from "../react-app-env";

export default function SearchGame(props: PropsAddCard) {
  const { open } = props;

  const [search, setSearch] = useState<string>(props.activeFilter.search);

  const handleClose = () => {
    props.setOpen!({ ...props!.open!, openSearch: false });
  };

  useEffect(()=>{
    setSearch(props.activeFilter.search)
  },[props.activeFilter.search])

  return (
    <div>
      <Dialog
        TransitionComponent={Transition}
        open={open!.openSearch}
        closeAfterTransition
        onClose={handleClose}
        fullWidth
      >
        <DialogTitle>Busque pelo título do jogo</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Faça uma busca pelo título do jogo
          </DialogContentText>
          <TextField
            size="small"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Título"
            value={search}
            autoFocus
            onChange={({ target }) => {
              setSearch(target.value);
            }}
            onKeyPress={({ charCode }) => {
              if (search && charCode === 13) {
                props.setActiveFilter({ ...props.activeFilter, search });
                handleClose();
              }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            size="small"
            onClick={handleClose}
            variant="outlined"
            color="primary"
          >
            Cancelar
          </Button>
          <Button
            disabled={!(Boolean(search))}
            size="small"
            variant="contained"
            endIcon={<Send />}
            type="submit"
            color="primary"
            onClick={() => {
              handleClose()
              props.setActiveFilter({ ...props.activeFilter, search });
            }}
          >
            {"Buscar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
