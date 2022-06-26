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

const NewSubraceDialog = () => {
  const dispatch = useDispatch();

  const showDialog = useSelector((state) => state.showNewSubraceDialog);

  const [subrace, setSubrace] = useState<string | undefined>(undefined);

  const onDismiss = () => {
    dispatch({
      type: "SetShowNewSubraceDialog",
      showNewSubraceDialog: false,
    });
  };

  const contentProps = {
    type: DialogType.largeHeader,
    title: "New race",
    closeButtonAriaLabel: "Close",
  };

  const onChangeSubrace = (_, value: string | undefined) => {
    setSubrace(value);
  };

  const onClickAddSubrace = () => {
    console.log("clicked add");
  };

  return (
    <Dialog
      hidden={!showDialog}
      onDismiss={onDismiss}
      dialogContentProps={contentProps}
    >
      <TextField
        label="Subrace name"
        value={subrace}
        onChange={onChangeSubrace}
      />
      <DialogFooter>
        <DefaultButton text="Cancel" onClick={onDismiss} />
        <PrimaryButton text="Add" onClick={onClickAddSubrace} />
      </DialogFooter>
    </Dialog>
  );
};

export default NewSubraceDialog;
