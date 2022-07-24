import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  Spinner,
  TextField,
} from "@fluentui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import DataService from "../../Helpers/DataService";

const RegistrationDialog = () => {
  const dispatch = useDispatch();

  const showDialog = useSelector((state) => state.showRegistrationDialog);

  const [email, setEmail] = useState<string | undefined>(undefined);
  const [emailRepeat, setEmailRepeat] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [passwordRepeat, setPasswordRepeat] = useState<string | undefined>(
    undefined
  );
  const [name, setName] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [messageBarMessage, setMessageBarMessage] = useState<
    string | undefined
  >(undefined);

  const onDismiss = () => {
    dispatch({
      type: "SetShowRegistrationDialog",
      showRegistrationDialog: false,
    });
  };

  const contentProps = {
    type: DialogType.largeHeader,
    title: "Register",
    closeButtonAriaLabel: "Close",
  };

  const onChangeEmail = (_, value: string | undefined) => {
    setEmail(value);
  };

  const onChangeEmailRepeat = (_, value: string | undefined) => {
    setEmailRepeat(value);
  };

  const onChangePassword = (_, value: string | undefined) => {
    setPassword(value);
  };

  const onChangePasswordRepeat = (_, value: string | undefined) => {
    setPasswordRepeat(value);
  };

  const onChangeName = (_, value: string | undefined) => {
    setName(value);
  };

  const onClickRegister = () => {
    if (password !== passwordRepeat) {
      throw new Error("Passwords do not match");
    }

    if (email && password && name) {
      setLoading(true);

      DataService.registerWithEmailAndPassword(email, password, name)
        .then(() => {
          onDismiss();
          toast.success("Successfully registered account");

          setLoading(false);
        })
        .catch((error) => {
          setMessageBarMessage(error.message);

          setLoading(false);
        });
    }
  };

  return (
    <Dialog
      hidden={!showDialog}
      onDismiss={onDismiss}
      dialogContentProps={contentProps}
    >
      {messageBarMessage && (
        <MessageBar
          messageBarType={MessageBarType.error}
          styles={{
            root: {
              maxWidth: "240px",
            },
          }}
        >
          {messageBarMessage}
        </MessageBar>
      )}
      <TextField label="Name" value={name} required onChange={onChangeName} />
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={onChangeEmail}
        invalid={!email}
        required
      />
      <TextField
        label="Repeat email"
        type="email"
        value={emailRepeat}
        onChange={onChangeEmailRepeat}
        required
        canRevealPassword
        invalid={
          email !== undefined &&
          emailRepeat !== undefined &&
          email !== emailRepeat
        }
        errorMessage={
          email !== undefined &&
          emailRepeat !== undefined &&
          email !== emailRepeat
            ? "Email addresses do not match"
            : ""
        }
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={onChangePassword}
        required
        canRevealPassword
      />
      <TextField
        label="Repeat password"
        type="password"
        value={passwordRepeat}
        onChange={onChangePasswordRepeat}
        required
        canRevealPassword
        invalid={
          password !== undefined &&
          passwordRepeat !== undefined &&
          password !== passwordRepeat
        }
        errorMessage={
          password !== undefined &&
          passwordRepeat !== undefined &&
          password !== passwordRepeat
            ? "Passwords do not match"
            : ""
        }
      />
      <DialogFooter>
        <DefaultButton text="Cancel" onClick={onDismiss} disabled={loading} />
        <PrimaryButton
          text="Register"
          onClick={onClickRegister}
          disabled={loading}
        >
          {loading && <Spinner />}
        </PrimaryButton>
      </DialogFooter>
    </Dialog>
  );
};

export default RegistrationDialog;
