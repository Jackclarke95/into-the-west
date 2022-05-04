import {
  DatePicker,
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  PrimaryButton,
} from "@fluentui/react";
import { useDispatch, useSelector } from "react-redux";

const SessionManagementDialog = () => {
  const dispatch = useDispatch();

  const showDialog = useSelector((state) => state.showSessionManagementDialog);

  const onDismiss = () => {
    dispatch({
      type: "SetShowSessionManagementDialog",
      showSessionManagementDialog: false,
    });
  };

  const onClickSave = () => {
    console.log("Clicked save");

    onDismiss();
  };

  const contentProps = {
    type: DialogType.largeHeader,
    title: "Manage session",
    closeButtonAriaLabel: "Close",
  };

  return (
    <Dialog
      hidden={!showDialog}
      onDismiss={onDismiss}
      dialogContentProps={contentProps}
    >
      <DatePicker label="Date" minDate={new Date()} />
      <DialogFooter>
        <DefaultButton text="Cancel" onClick={onDismiss} />
        <PrimaryButton text="Save" onClick={onClickSave} />
      </DialogFooter>
    </Dialog>
  );
};

export default SessionManagementDialog;
