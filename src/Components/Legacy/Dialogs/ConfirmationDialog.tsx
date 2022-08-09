import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  IDialogContentProps,
  PrimaryButton,
} from "@fluentui/react";
import { useDispatch, useSelector } from "react-redux";

const ConfirmationDialog = () => {
  const dispatch = useDispatch();

  const confirmation = useSelector((state) => state.confirmation);

  const onDismiss = () => {
    dispatch({
      type: "SetConfirmation",
      confirmation: { isShown: false },
    });
  };

  const dialogContentProps: IDialogContentProps | undefined =
    confirmation.isShown
      ? {
          type: DialogType.largeHeader,
          title: "Confirm",
          closeButtonAriaLabel: "Close",
          subText: confirmation.message,
        }
      : undefined;

  const onClickConfirm = () => {
    if (confirmation.isShown) {
      confirmation.onConfirm();
      onDismiss();
    }
  };

  return (
    <Dialog
      dialogContentProps={dialogContentProps}
      hidden={!confirmation.isShown}
    >
      <DialogFooter>
        <DefaultButton text="Cancel" onClick={onDismiss} />
        <PrimaryButton text="Confirm" onClick={onClickConfirm} />
      </DialogFooter>
    </Dialog>
  );
};

export default ConfirmationDialog;
