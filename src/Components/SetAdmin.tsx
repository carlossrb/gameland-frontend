import React, { useState } from "react";
import {
  TextField,
  Button,
  DialogActions,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  CircularProgress
} from "@material-ui/core";
import { SupervisorAccount } from "@material-ui/icons";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { validateEmail, AxiosPut, ShowSnackBarAlert, Transition } from "../utils/index";
import { green } from "@material-ui/core/colors";

interface PropsModal {
  openModal: () => void;
  open: boolean;
}
interface State {
  msg: string;
  status: number;
  severity?: "success" | "info" | "warning" | "error";
}

/**
 * Abre modal para conta Master definir moderadores da plataforma
 * @param {PropsModal} props
 */
const SetAdmin: React.FC<PropsModal> = (props) => {
  const { open, openModal } = props;
  const [email, setEmail] = useState({ isValid: false, email: "" });
  const [load, setLoad] = useState(false);
  const [sendOrnot, setSend] = useState<State>({ msg: "", status: 0 });

  // Cadastra um jogador como admin
  const turnAdmin = () => {
    setLoad(true);
    AxiosPut("/auth/admin", { email: email.email })
      .then((res: any) => {
        setLoad(false);
        setSend({
          msg: "Jogador atualizado como administrador!",
          status: 1,
          severity: "success",
        });
        setEmail({isValid:false, email:''})
      })
      .catch(({ response }: any) => {
        setLoad(false);
        setSend({
          msg: response
            ? response.data.error
            : "Problemas na conexão. Tente novamente",
          status: 2,
          severity: "error",
        });
      });
  };
  return (
    <div>
      {sendOrnot.status !== 0 && (
        <ShowSnackBarAlert
          msg={sendOrnot.msg}
          anchorOrigin={["top", "center"]}
          dispatchClose={() => setSend({ ...sendOrnot, status: 0 })}
          openCondition={sendOrnot.status !== 0}
          severity={sendOrnot.severity}
          time={5000}
        />
      )}
      <Dialog
        open={open}
        onClose={() => openModal()}
        closeAfterTransition
        TransitionComponent={Transition}
      >
        <DialogTitle>Conceder privilégios</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Digite o email de um jogador para torná-lo administrador
          </DialogContentText>
          <TextField
            disabled={load}
            size="small"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            value={email.email}
            autoComplete="email"
            autoFocus
            InputProps={{
              endAdornment: email.isValid && (
                <InputAdornment position="end">
                  <CheckCircleOutlineIcon
                    style={{ color: green[400] }}
                    fontSize="small"
                  />
                </InputAdornment>
              ),
            }}
            onChange={({ target }) => {
              validateEmail(target.value)
                ? setEmail({ isValid: true, email: target.value })
                : setEmail({ isValid: false, email: target.value });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            disabled={load}
            size="small"
            onClick={() => openModal()}
            variant="outlined"
            color="primary"
          >
            Cancelar
          </Button>
          <Button
            disabled={!email.isValid || load}
            size="small"
            variant="contained"
            endIcon={load ? <CircularProgress size={20} /> : <SupervisorAccount />}
            type="submit"
            color="primary"
            onClick={turnAdmin}
          >
            {load ? "Atualizando" : "Atualizar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SetAdmin;
