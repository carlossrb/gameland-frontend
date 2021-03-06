import React, { useState } from "react";
import Backdrop from "@material-ui/core/Backdrop";
import {
  TextField,
  Button,
  DialogActions,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  CircularProgress,
} from "@material-ui/core";
import { Send } from "@material-ui/icons";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import { validateEmail, AxiosPost, ShowSnackBarAlert } from "../utils/index";
import { green } from "@material-ui/core/colors";

interface PropsModal {
  openModal: (showModal: boolean) => void;
  open: boolean;
}
interface State {
  msg: string;
  status: number;
  severity?: "success" | "info" | "warning" | "error";
}

/**
 * Abre modal para recuperação de senha
 * @param {PropsModal} props
 */
const Password: React.FC<PropsModal> = (props) => {
  const { open, openModal } = props;
  const [email, setEmail] = useState({ isValid: false, email: "" });
  const [load, setLoad] = useState(false);
  const [sendOrnot, setSend] = useState<State>({ msg: "", status: 0 });

  // Envia email de recuperação de senha
  const sendMail = () => {
    setLoad(true);
    AxiosPost("/auth/forgot_password", { email: email.email })
      .then((res: any) => {
        setLoad(false);
        setSend({
          msg: "Email enviado com sucesso!",
          status: 1,
          severity: "success",
        });
        setEmail({ isValid: false, email: "" });
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
        open={open || load}
        onClose={() => openModal(false)}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <DialogTitle>Redefina a sua senha</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Clique em enviar que um link será enviado para você redefinir sua
            senha
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
            onKeyPress={({ charCode }) =>
              charCode === 13 && validateEmail(email.email) && sendMail()
            }
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
            onClick={() => openModal(false)}
            variant="outlined"
            color="primary"
          >
            Cancelar
          </Button>
          <Button
            disabled={!email.isValid || load}
            size="small"
            variant="contained"
            endIcon={load ? <CircularProgress size={20} /> : <Send />}
            type="submit"
            color="primary"
            onClick={sendMail}
          >
            {load ? "Enviando" : "Enviar"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Password;
