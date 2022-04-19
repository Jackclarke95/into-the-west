import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  PrimaryButton,
  TextField,
  Toggle,
} from "@fluentui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  const [discordName, setDiscordName] = useState<string | undefined>(undefined);
  const [dndBeyondName, setDndBeyondName] = useState<string | undefined>(
    undefined
  );
  const [isDungeonMaster, setIsDungeonMaster] = useState(false);
  const [isGamesMaster, setIsGamesMaster] = useState(false);

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

  const onChangeDiscordName = (_, value: string | undefined) => {
    setDiscordName(value);
  };

  const onChangeDndBeyondName = (_, value: string | undefined) => {
    setDndBeyondName(value);
  };

  const onChangeIsDungeonMaster = (_, checked: boolean | undefined) => {
    if (checked) {
      setIsDungeonMaster(false);
    }
  };

  const onChangeIsGamesMaster = (_, checked: boolean | undefined) => {
    if (checked) {
      setIsGamesMaster(checked);
    }
  };

  const onClickRegister = () => {
    if (password !== passwordRepeat) {
      throw new Error("Passwords do not match");
    }

    if (email && password && name && discordName && dndBeyondName) {
      console.log(
        email,
        password,
        name,
        discordName,
        dndBeyondName,
        isDungeonMaster,
        isGamesMaster
      );

      DataService.registerWithEmailAndPassword(
        email,
        password,
        name,
        discordName,
        dndBeyondName,
        isDungeonMaster,
        isGamesMaster
      );
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
      <TextField label="Name" value={name} required onChange={onChangeName} />
      <TextField
        label="Discord name"
        value={discordName}
        required
        onChange={onChangeDiscordName}
      />
      <TextField
        label="D&D Beyond name"
        value={dndBeyondName}
        required
        onChange={onChangeDndBeyondName}
      />
      <Toggle
        label="Dungeon master"
        inlineLabel
        onChange={onChangeIsDungeonMaster}
      />
      <Toggle
        label="Games master"
        inlineLabel
        onChange={onChangeIsGamesMaster}
      />
      <DialogFooter>
        <DefaultButton text="Cancel" onClick={onDismiss} />
        <PrimaryButton text="Register" onClick={onClickRegister} />
      </DialogFooter>
    </Dialog>
  );
};

export default RegistrationDialog;
