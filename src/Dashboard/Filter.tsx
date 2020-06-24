import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { PropsAddCard } from "../react-app-env";
import { Grid, Checkbox, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { platforms, categories, icon, checkedIcon } from "./AddNewGame";
import { Transition } from "../utils";
import { Games } from "@material-ui/icons";

interface StateValues {
  category: string[];
  platform: string[];
}

export default function Filter(props: PropsAddCard) {
  const [values, setValues] = useState<StateValues>({
    platform: [],
    category: [],
  });

  useEffect(()=>{
    setValues({...props.activeFilter})
  },[props.activeFilter.category, props.activeFilter.platform])

  const handleClose = () => {
    props!.setOpen!({ ...props!.open!, openFilter: false });
  };


  const renderGrid = (
    <Grid container spacing={1}>
      <Grid item xs>
        <Autocomplete
          onChange={(value, array, b) =>
            setValues({ ...values, platform: array })
          }
          size="small"
          value={values.platform}
          multiple
          limitTags={2}
          options={platforms}
          disableCloseOnSelect
          getOptionLabel={(option) => option}
          renderOption={(option, { selected }) => {
            return (
              <>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option}
              </>
            );
          }}
          //style={{ width: 500 }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              variant="outlined"
              label="Plataformas"
            />
          )}
        />
      </Grid>
      <Grid item xs>
        <Autocomplete
          onChange={(value, array, b) =>
            setValues({ ...values, category: array })
          }
          size="small"
          value={values.category}
          multiple
          limitTags={2}
          options={categories}
          disableCloseOnSelect
          getOptionLabel={(option) => {
            return option;
          }}
          renderOption={(option, { selected }) => {
            return (
              <>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option}
              </>
            );
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              fullWidth
              variant="outlined"
              label="Categorias"
              //placeholder="Favorites"
            />
          )}
        />
      </Grid>
    </Grid>
  );

  return (
    <div>
      <Dialog
        open={props!.open!.openFilter}
        onClose={handleClose}
        TransitionComponent={Transition}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">{"Filtrar Jogos"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Filtre tanto por plataformas, quanto por categorias
          </DialogContentText>
          {renderGrid}
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
            disabled={
              values.platform.length === 0 &&
              values.category.length === 0
            }
            size="small"
            variant="contained"
            endIcon={<Games />}
            type="button"
            color="primary"
            onClick={()=>{
              props.setActiveFilter({...props.activeFilter, ...values})
              handleClose()
            }}
          >
            {"Filtrar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
