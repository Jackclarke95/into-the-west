import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  TextField,
} from "@fluentui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import DataService from "../../Helpers/DataService";

const PasswordManagementDialog = () => {
  const dispatch = useDispatch();

  const showAccountManagementDialog = useSelector(
    (state) => state.showPasswordManagementDialog
  );
  const user = useSelector((state) => state.authUser);

  const [password, setPassword] = useState<string | undefined>(undefined);
  const [passwordRepeat, setPasswordRepeat] = useState<string | undefined>(
    undefined
  );
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const onChangePassword = (_, value: string | undefined) => {
    setPassword(value);
  };

  const onChangePasswordRepeat = (_, value: string | undefined) => {
    setPasswordRepeat(value);
  };

  const contentProps = {
    type: DialogType.largeHeader,
    title: "Manage account",
    closeButtonAriaLabel: "Close",
  };

  const onClickUpdatePassword = async () => {
    if (!password) {
      setErrorMessage("Please enter a new password");

      return;
    } else if (!passwordRepeat) {
      setErrorMessage("Please repeat password");

      return;
    } else if (password !== passwordRepeat) {
      setErrorMessage("Passwords do not match");

      return;
    }

    await DataService.changePassword(user!, password)
      .then(() => {
        onDismiss();
        
        toast.success("Password changed successfully");
      })
      .catch((error) => {
        console.log("returned error:", error);

        let formattedErrorMessage = "";

        if (error.message.includes("requires-recent-login")) {
          formattedErrorMessage =
            "You need to log out and back in again to change your password";
        } else {
          formattedErrorMessage = error.message
            .replace("FirebaseError: Firebase:", "")
            .replace(/ *\([^)]*\) */g, "")
            .trim();
        }

        setErrorMessage(formattedErrorMessage);
      });
  };

  const onDismiss = () => {
    setPassword(undefined);
    setPasswordRepeat(undefined);

    dispatch({
      type: "SetShowPasswordManagementDialog",
      showPasswordManagementDialog: false,
    });
  };

  return (
    <Dialog
      dialogContentProps={contentProps}
      hidden={!showAccountManagementDialog}
      onDismiss={onDismiss}
    >
      {errorMessage && (
        <MessageBar
          messageBarType={MessageBarType.error}
          styles={{
            root: {
              maxWidth: "240px",
            },
          }}
        >
          {errorMessage}
        </MessageBar>
      )}
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
        <DefaultButton text="Cancel" onClick={onDismiss} />
        <PrimaryButton text="Update" onClick={onClickUpdatePassword} />
      </DialogFooter>
    </Dialog>
  );
};

export default PasswordManagementDialog;
