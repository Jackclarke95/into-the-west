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
import { toast } from "react-toastify";
import DataService from "../../Helpers/DataService";

const NewRaceDialog = () => {
  const dispatch = useDispatch();

  const showDialog = useSelector((state) => state.showNewRaceDialog);

  const [race, setRace] = useState<string | undefined>(undefined);
  const [subraceRequired, setSubraceRequired] = useState<boolean>(false);

  const onDismiss = () => {
    dispatch({
      type: "SetShowNewRaceDialog",
      showNewRaceDialog: false,
    });
  };

  const contentProps = {
    type: DialogType.close,
    title: "New race",
    closeButtonAriaLabel: "Close",
  };

  const onChangeRace = (_, value: string | undefined) => {
    setRace(value);
  };

  const onChangeIsSubraceRequired = (_, checked: boolean | undefined) => {
    if (checked !== undefined) {
      setSubraceRequired(checked);
    }
  };

  const onClickAddRace = () => {
    console.log("clicked add");

    if (!race) {
      toast.error("Race name required");

      return;
    }

    DataService.createRace(race, subraceRequired);
  };

  return (
    <Dialog
      hidden={!showDialog}
      onDismiss={onDismiss}
      dialogContentProps={contentProps}
    >
      <TextField
        label="Race name"
        value={race}
        required
        onChange={onChangeRace}
      />
      <Toggle
        label="Subrace required"
        onText="Yes"
        offText="No"
        onChange={onChangeIsSubraceRequired}
      />
      <DialogFooter>
        <DefaultButton text="Cancel" onClick={onDismiss} />
        <PrimaryButton text="Add" onClick={onClickAddRace} />
      </DialogFooter>
    </Dialog>
  );
};

export default NewRaceDialog;
