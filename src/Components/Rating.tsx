import React, { useState, useContext } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import { blue, yellow } from "@material-ui/core/colors";
import {
  StarBorder,
  Star,
  EmojiEmotions,
  EmojiEmotionsOutlined,
  SportsEsportsOutlined,
  SportsEsports,
} from "@material-ui/icons";
import { Rating } from "@material-ui/lab";
import {
  DialogActions,
  CircularProgress,
  DialogContent,
} from "@material-ui/core";
import { ProductData } from "../react-app-env";
import { Transition, AxiosPut, ShowSnackBarAlert } from "../utils";
import { store } from "../Store";

export interface SimpleDialogProps {
  openEvaluation: boolean;
  setdataCard: React.Dispatch<React.SetStateAction<ProductData>>;
  dataCard: ProductData;
  setopenEvaluation: React.Dispatch<React.SetStateAction<boolean>>;
}

const RatingComponent: React.FC<SimpleDialogProps> = (props) => {
  const [load, setLoad] = React.useState(false);
  const { openEvaluation, setdataCard, dataCard, setopenEvaluation } = props;
  const [values, setvalues] = useState({
    games: 0,
    stars: 0,
    smilles: 0,
    ratinglength: 0,
  });
  const { ratinglength, smilles, stars, games } = props.dataCard;
  const [error, setError] = useState({ msg: "", error: false, type: false });
  const UserData = useContext(store);
  const { setDataReducer, dataReducer } = UserData;

  const onChangeRating = (newValue: number, index: number, type: number) => {
    let media = (ratinglength * type + newValue) / (ratinglength + 1);
    if (index === 1) setvalues({ ...values, games: media });
    else if (index === 2) setvalues({ ...values, smilles: media });
    else setvalues({ ...values, stars: media });
  };

  const updateRating = () => {
    setLoad(true);
    AxiosPut("/rating/" + dataCard._id, {
      ...values,
      ratinglength: ratinglength + 1,
    })
      .then((e) => {
        setLoad(false);
        const newLength = ratinglength + 1;
        setdataCard({ ...dataCard, ...values, ratinglength: newLength });
        dataReducer.user.rating.push({ productId: dataCard._id, ...values });
        setDataReducer({ type: "LOGIN_DATA", values: { ...dataReducer } });
        setError({
          msg: "Obrigado por avaliar!",
          error: true,
          type: false,
        });
        setopenEvaluation(false);
      })
      .catch(({ response }) => {
        setLoad(false);
        setError({
          msg: response
            ? response.data.error
            : "Houve um problema para avaliar, tente novamente!",
          error: true,
          type: true,
        });
      });
  };
  return (
    <>
      {error.type && (
        <ShowSnackBarAlert
          anchorOrigin={["top", "center"]}
          dispatchClose={() => setError({ ...error, type: false })}
          openCondition={error.type}
          msg={error.msg}
          time={5000}
          severity={error.error ? "warning" : "success"}
        />
      )}

      <Dialog
        TransitionComponent={Transition}
        maxWidth="xs"
        onClose={() => setopenEvaluation(false)}
        open={openEvaluation}
        closeAfterTransition
      >
        <DialogTitle>{"Avalie o jogo ("+dataCard.ratinglength+")"}</DialogTitle>
        <DialogContent>
          <List>
            <ListItem>
              <ListItemText primary="Jogabilidade" />
              <GamesIconRating
                onChange={(event, newValue: any) => {
                  onChangeRating(newValue, 1, games);
                }}
                disabled={load}
                name="Games"
                defaultValue={0}
                precision={0.5}
                emptyIcon={<SportsEsportsOutlined fontSize="inherit" />}
                icon={<SportsEsports />}
              />
            </ListItem>

            <ListItem>
              <ListItemText primary="Conteúdo" />
              <SmilleIconRating
                onChange={(event, newValue: any) => {
                  onChangeRating(newValue, 2, smilles);
                }}
                disabled={load}
                name="Smille"
                defaultValue={0}
                precision={0.5}
                icon={<EmojiEmotions />}
                emptyIcon={<EmojiEmotionsOutlined fontSize="inherit" />}
              />
            </ListItem>
            <ListItem>
              <ListItemText primary="Avaliação geral" />
              <StarIconRating
                onChange={(event, newValue: any) => {
                  onChangeRating(newValue, 3, stars);
                }}
                disabled={load}
                name="Stars"
                defaultValue={0}
                precision={0.5}
                emptyIcon={<StarBorder fontSize="inherit" />}
              />
            </ListItem>
          </List>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={load}
            size="small"
            onClick={() => setopenEvaluation(false)}
            variant="outlined"
            color="primary"
          >
            Cancelar
          </Button>
          <Button
            disabled={load}
            size="small"
            variant="contained"
            endIcon={load ? <CircularProgress size={20} /> : <Star />}
            type="submit"
            color="primary"
            onClick={updateRating}
          >
            {load ? "Avaliando" : "Avaliar"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const GamesIconRating = withStyles({
  iconFilled: {
    color: "#7d42eb",
  },
  iconHover: {
    color: "#925ef2",
  },
})(Rating);

const SmilleIconRating = withStyles({
  iconFilled: {
    color: blue[700],
  },
  iconHover: {
    color: blue[600],
  },
})(Rating);

const StarIconRating = withStyles({
  iconFilled: {
    color: yellow.A400,
  },
  iconHover: {
    color: yellow[600],
  },
})(Rating);

export default RatingComponent;
