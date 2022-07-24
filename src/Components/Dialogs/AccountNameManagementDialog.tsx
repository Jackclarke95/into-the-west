import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  PrimaryButton,
  Text,
  TextField,
} from "@fluentui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const AccountNameManagementDialog = () => {
  const dispatch = useDispatch();

  const showAccountManagementDialog = useSelector(
    (state) => state.showAccountNameManagementDialog
  );

  const [name, setName] = useState<string | undefined>(undefined);

  const onChangeName = (_, value: string | undefined) => {
    setName(value);
  };

  const contentProps = {
    type: DialogType.largeHeader,
    title: "Manage account",
    closeButtonAriaLabel: "Close",
  };

  const onClickSaveAccountSettings = () => {
    console.log("Save account settings");
  };

  const onDismiss = () => {
    setName(undefined);

    dispatch({
      type: "SetShowAccountNameManagementDialog",
      showAccountNameManagementDialog: false,
    });
  };

  return (
    <Dialog
      dialogContentProps={contentProps}
      hidden={!showAccountManagementDialog}
      onDismiss={onDismiss}
    >
      <Text>Leave blank to omit from update</Text>
      <TextField label="Name" value={name} onChange={onChangeName} />
      <DialogFooter>
        <DefaultButton text="Cancel" onClick={onDismiss} />
        <PrimaryButton text="Save" onClick={onClickSaveAccountSettings} />
      </DialogFooter>
    </Dialog>
  );
};

export default AccountNameManagementDialog;
