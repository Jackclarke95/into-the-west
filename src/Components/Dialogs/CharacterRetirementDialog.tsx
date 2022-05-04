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

const CharacterRetirementDialog = () => {
  const dispatch = useDispatch();

  const activeCharacter = useSelector((state) => state.activeCharacter);
  const showDialog = useSelector(
    (state) => state.showCharacterRetirementDialog
  );

  const [retirementReason, setRetirementReason] = useState<undefined | string>(
    undefined
  );

  const onDismiss = () => {
    dispatch({
      type: "SetShowCharacterRetirementDialog",
      showCharacterRetirementDialog: false,
    });
  };

  const onClickRetireCharacter = () => {
    if (
      activeCharacter.isLoading ||
      !activeCharacter.data ||
      !retirementReason
    ) {
      return;
    }

    DataService.retireCharacter(activeCharacter.data, retirementReason);

    dispatch({
      type: "SetShowCharacterRetirementDialog",
      showCharacterRetirementDialog: false,
    });
  };

  const onChangeRetirementReason = (
    _: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string | undefined
  ) => {
    setRetirementReason(newValue);
  };

  const contentProps = {
    type: DialogType.largeHeader,
    title: "Retire character",
    closeButtonAriaLabel: "Close",
  };

  return (
    <Dialog
      hidden={!showDialog}
      onDismiss={onDismiss}
      dialogContentProps={contentProps}
    >
      <TextField
        label="Reason for retirement"
        onChange={onChangeRetirementReason}
      />
      <DialogFooter>
        <DefaultButton text="Cancel" onClick={onDismiss} />
        <PrimaryButton text="Retire" onClick={onClickRetireCharacter} />
      </DialogFooter>
    </Dialog>
  );
};

export default CharacterRetirementDialog;
