import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {
  Grid,
  TextField,
  Checkbox,
  makeStyles,
  Theme,
  createStyles,
  Typography,
  DialogContentText,
  CircularProgress,
} from "@material-ui/core";
import CheckBoxOutlineBlankIcon from "@material-ui/icons/CheckBoxOutlineBlank";
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import { Autocomplete } from "@material-ui/lab";
import { ShowSnackBarAlert, AxiosPost, Transition } from "../utils";
import Dropzone from "react-dropzone";
import {
  CloudUpload,
  CheckCircleOutline,
  ErrorOutline,
  Games,
} from "@material-ui/icons";
import { green, red } from "@material-ui/core/colors";
import { PropsAddCard } from "../react-app-env";

const mbDivisor = 1024 * 1024;
const maxMbFileSize = 0.2 * mbDivisor; // 5Mb
export const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
export const checkedIcon = <CheckBoxIcon fontSize="small" />;
export const platforms = ["PS4", "XboxOne", "PC", "Android", "Ios"];
export const categories = [
  "Ação",
  "Aventura",
  "RPG",
  "Simulação",
  "Esporte",
  "Corrida",
];

interface StateValues {
  img: string;
  title: string;
  description: string;
  category: string[];
  platforms: string[];
}
export default function AddNewGame(props: PropsAddCard) {
  const [load, setLoad] = useState(false);
  const [values, setValues] = useState<StateValues>({
    img: "",
    title: "",
    description: "",
    category: [],
    platforms: [],
  });
  const [imgError, setImgError] = useState(false);
  const [errorInsert, seterrorInsert] = useState({
    msg: "",
    error: false,
    type: "error",
  });
  const classes = useStyles();

  const handleClose = () => {
    props!.setOpen!({ ...props!.open!, openNewGame: false });
    setValues({
      title: "",
      description: "",
      category: [],
      platforms: [],
      img: "",
    });
  };

  const insertNewGame = () => {
    setLoad(true);
    AxiosPost("/product/", values)
      .then(({ data }) => {
        seterrorInsert({
          msg: "O jogo foi inserido com sucesso!",
          error: true,
          type: "success",
        });
        setLoad(false);
        handleClose();
        props.listAllCards()
      })
      .catch(({ response }) => {
        setLoad(false);
        seterrorInsert({
          msg: response
            ? response.data.error
            : "Houve um problema ao inserir o jogo. Tente novamente!",
          error: true,
          type: "error",
        });
      });
  };

  const renderGrid = (
    <Grid container spacing={1}>
      {/* Titulo e foto */}
      <Grid item xs={4}>
        <TextField
          autoFocus
          size="small"
          //disabled={values.load}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Título"
          onChange={({ target }) =>
            setValues({ ...values, title: target.value })
          }
        />
      </Grid>
      {/* descrição/categoria e platforma */}
      <Grid item xs={8}>
        <TextField
          size="small"
          placeholder="Pequena descrição do jogo"
          //disabled={values.load}
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Descrição"
          onChange={({ target }) =>
            setValues({ ...values, description: target.value })
          }
        />
      </Grid>
      <Grid item xs={6}>
        <Autocomplete
          onChange={(value, array, b) =>
            setValues({ ...values, platforms: array })
          }
          size="small"
          value={values.platforms}
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
              required
              fullWidth
              variant="outlined"
              label="Plataformas"
            />
          )}
        />
      </Grid>
      <Grid item xs={6}>
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
            //selectValuesArray(option, selected, 2);
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
              required
              variant="outlined"
              label="Categorias"
              //placeholder="Favorites"
            />
          )}
        />
      </Grid>
      <Grid xs={12}>
        <Dropzone
          multiple={false}
          accept={[".jpg", ".png"]}
          maxSize={maxMbFileSize}
          onDrop={(acceptedFiles) => {
            if (acceptedFiles.length > 0) {
              const file = acceptedFiles[0];
              const reader = new FileReader();
              reader.onload = (event: any) => {
                setValues({ ...values, img: event.target.result });
              };
              reader.readAsDataURL(file);
            } else {
              setValues({ ...values, img: "" });
              setImgError(true);
            }
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <>
              <div className={classes.dropzone} {...getRootProps()}>
                <input {...getInputProps()} />
                <Typography variant="h6">
                  Arraste seu arquivo ou clique para fazer upload
                </Typography>
                {values.img === "" && !imgError && (
                  <CloudUpload fontSize={"large"} color="disabled" />
                )}
                {values.img !== "" && (
                  <>
                    <CheckCircleOutline
                      fontSize={"large"}
                      style={{ color: green[300] }}
                    />
                    <Typography variant="subtitle1"> Tudo Ok!</Typography>
                  </>
                )}
                {imgError && (
                  <>
                    <ErrorOutline
                      fontSize={"large"}
                      style={{ color: red[300] }}
                    />

                    <Typography variant="subtitle1">
                      Erro ao anexar sua imagem
                    </Typography>
                  </>
                )}
              </div>
            </>
          )}
        </Dropzone>
      </Grid>
    </Grid>
  );

  return (
    <>
      {imgError && (
        <ShowSnackBarAlert
          msg={
            "Houve um erro ao anexar a imagem. Ela ultrapassa o tamanho máximo permitido"
          }
          anchorOrigin={["top", "center"]}
          dispatchClose={() => setImgError(false)}
          openCondition={imgError}
          severity={"error"}
          time={5000}
        />
      )}
      {errorInsert.error && (
        <ShowSnackBarAlert
          msg={errorInsert.msg}
          anchorOrigin={["top", "center"]}
          dispatchClose={() => seterrorInsert({ ...errorInsert, error: false })}
          openCondition={errorInsert.error}
          severity={errorInsert.type === "error" ? "error" : "success"}
          time={5000}
        />
      )}
      <Dialog TransitionComponent={Transition} maxWidth="sm" fullWidth={true} open={props!.open!.openNewGame}>
        <DialogTitle>{"Adicionar novo jogo"}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {"Preencha os dados e anexe a imagem do seu jogo no tamanho máximo de " +
              (maxMbFileSize / mbDivisor).toFixed(2) +
              " Mb"}
          </DialogContentText>
          {renderGrid}
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
          <Button
            disabled={
              values.img === "" ||
              values.title === "" ||
              values.platforms.length === 0 ||
              values.category.length === 0 ||
              load
            }
            size="small"
            variant="contained"
            endIcon={load ? <CircularProgress size={20} /> : <Games />}
            type="submit"
            color="primary"
            onClick={insertNewGame}
          >
            {load ? "Adicionando" : "Adicionar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dropzone: {
      background: theme.palette.divider,
      height: theme.spacing(12),
      cursor: "pointer",
      borderColor: theme.palette.primary.main,
      borderWidth: 2,
      borderRadius: theme.spacing(1),
      borderStyle: "dashed",
      margin: theme.spacing(0.7),
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    iconColor: {},
  })
);
