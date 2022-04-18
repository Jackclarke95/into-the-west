import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  PrimaryButton,
  TextField,
} from "@fluentui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataService from "../../Helpers/DataService";

const RegistrationDialog = () => {
  const dispatch = useDispatch();

  const showDialog = useSelector((state) => state.showRegistrationDialog);

  const [email, setEmail] = useState<string | undefined>(undefined);
  const [password, setPassword] = useState<string | undefined>(undefined);
  const [passwordRepeat, setPasswordRepeat] = useState<string | undefined>(
    undefined
  );

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

  const onChangePassword = (_, value: string | undefined) => {
    setPassword(value);
  };

  const onChangePasswordRepeat = (_, value: string | undefined) => {
    setPasswordRepeat(value);
  };

  const onClickRegister = () => {
    if (password !== passwordRepeat) {
      throw new Error("Passwords do not match");
    }

    if (email && password) {
      console.log(email, password);

      DataService.registerWithEmailAndPassword(email, password);
    }

    dispatch({
      type: "SetShowRegistrationDialog",
      showRegistrationDialog: false,
    });
  };

  return (
    <Dialog
      hidden={!showDialog}
      onDismiss={onDismiss}
      dialogContentProps={contentProps}
    >
      <TextField
        label="Email"
        value={email}
        onChange={onChangeEmail}
        invalid={!email}
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={onChangePassword}
        required
      />
      <TextField
        label="Repeat Password"
        type="password"
        value={passwordRepeat}
        onChange={onChangePasswordRepeat}
        required
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
        <DefaultButton text="Cancel" onClick={onDismiss} />
        <PrimaryButton text="Register" onClick={onClickRegister} />
      </DialogFooter>
    </Dialog>
  );
};

export default RegistrationDialog;
