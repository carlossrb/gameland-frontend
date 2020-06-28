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
  Tooltip,
} from "@material-ui/core";
import { ProductData } from "../react-app-env";
import { Transition, AxiosPut, ShowSnackBarAlert } from "../utils";
import PeopleAltIcon from "@material-ui/icons/PeopleAlt";
import { store } from "../Store";

interface SimpleDialogProps {
  openEvaluation: boolean;
  setdataCard: React.Dispatch<React.SetStateAction<ProductData>>;
  dataCard: ProductData;
  setopenEvaluation: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Avaliação do jogo de forma dinâmica. Se o usuário avaliou e avaliar novamente, a média sera recalculada
 * @param props
 */
const RatingComponent: React.FC<SimpleDialogProps> = (props) => {
  const [load, setLoad] = React.useState(false);
  const UserData = useContext(store);
  const { dataReducer } = UserData;
  const { openEvaluation, setdataCard, dataCard, setopenEvaluation } = props;

  let value =
    dataReducer.user.permission !== 4
      ? dataReducer.user.rating.filter((e: any) => e.productId === dataCard._id)
      : [];
  const [values, setvalues] = useState({
    games: value.length > 0 ? value[0].games : 0,
    stars: value.length > 0 ? value[0].stars : 0,
    smilles: value.length > 0 ? value[0].smilles : 0,
  });

  const { smilles, stars, games } = props.dataCard;
  const [error, setError] = useState({ msg: "", error: false, type: false });

  const onChangeRating = (newValue: number, index: number, type: number) => {
    if (index === 1) setvalues({ ...values, games: newValue || 0 });
    else if (index === 2) setvalues({ ...values, smilles: newValue || 0 });
    else setvalues({ ...values, stars: newValue || 0 });
  };

  const updateRating = () => {
    setLoad(true);
    AxiosPut("/rating/" + dataCard._id, {
      ...values,
    })
      .then(({ data }: any) => {
        setLoad(false);
        setdataCard({ ...data.product });
        setError({
          msg: "Obrigado por avaliar!",
          error: false,
          type: true,
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
        <DialogTitle>
          <Tooltip title="Quantidade de pessoas que avaliaram">
            <span style={{ display: "flex", alignItems: "center" }}>
              {"Avalie o jogo (" + dataCard.ratinglength + ")"}
              <PeopleAltIcon />
            </span>
          </Tooltip>
        </DialogTitle>
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
                value={values.games}
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
                value={values.smilles}
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
                value={values.stars}
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
            onClick={() => {
              setopenEvaluation(false);
            }}
            variant="outlined"
            color="primary"
          >
            Cancelar
          </Button>
          <Button
            disabled={load || !values.stars}
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
