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

const CharacterManagementDialog = () => {
  const dispatch = useDispatch();

  const showDialog = useSelector(
    (state) => state.showCharacterManagementDialog
  );

  const [name, setEmail] = useState<string | undefined>(undefined);

  const onDismiss = () => {
    dispatch({
      type: "SetShowCharacterManagementDialog",
      showCharacterManagementDialog: false,
    });
  };

  const contentProps = {
    type: DialogType.largeHeader,
    title: "Manage character",
    closeButtonAriaLabel: "Close",
  };

  const onChangeName = (_, value: string | undefined) => {
    setEmail(value);
  };

  const onClickUpdate = () => {
    console.log("Clicked update", name);

    dispatch({
      type: "SetShowCharacterManagementDialog",
      showCharacterManagementDialog: false,
    });
  };

  return (
    <Dialog
      hidden={!showDialog}
      onDismiss={onDismiss}
      dialogContentProps={contentProps}
    >
      <TextField
        label="Name"
        type="text"
        value={name}
        onChange={onChangeName}
        invalid={!name}
        required
      />

      <DialogFooter>
        <DefaultButton text="Cancel" onClick={onDismiss} />
        <PrimaryButton text="Update" onClick={onClickUpdate} />
      </DialogFooter>
    </Dialog>
  );
};

export default CharacterManagementDialog;
