import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  MessageBar,
  MessageBarType,
  PrimaryButton,
  TextField,
  Toggle,
} from "@fluentui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataService from "../../Helpers/DataService";

const NewRaceDialog = () => {
  const dispatch = useDispatch();

  const showDialog = useSelector((state) => state.showNewRaceDialog);
  const races = useSelector((state) => state.races);

  const [raceName, setRaceName] = useState<string | undefined>(undefined);
  const [subraceRequired, setSubraceRequired] = useState<boolean>(false);
  const [messageBarMessage, setMessageBarMessage] = useState<
    string | undefined
  >(undefined);
  const [messageBarType, setMessageBarType] = useState<MessageBarType>(
    MessageBarType.info
  );

  const onDismiss = () => {
    dispatch({
      type: "SetShowNewRaceDialog",
      showNewRaceDialog: false,
    });
  };

  const contentProps = {
    type: DialogType.largeHeader,
    title: "New race",
    closeButtonAriaLabel: "Close",
  };

  const onChangeRace = (_, value: string | undefined) => {
    setRaceName(value);
  };

  const onChangeIsSubraceRequired = (_, checked: boolean | undefined) => {
    if (checked !== undefined) {
      setSubraceRequired(checked);
    }
  };

  const onClickAddRace = () => {
    console.log("clicked add");

    if (!raceName) {
      setMessageBarMessage("Race name required");
      setMessageBarType(MessageBarType.error);

      return;
    }

    if (races.isLoading) {
      setMessageBarMessage("Could not load current races");
      setMessageBarType(MessageBarType.error);

      return;
    }

    if (
      races.data.some(
        (race) => race.name.toLowerCase() === raceName.toLowerCase()
      )
    ) {
      setMessageBarMessage("Race already exists");
      setMessageBarType(MessageBarType.error);

      return;
    }

    DataService.createRace(raceName, subraceRequired)
      .then((response) => {
        setMessageBarMessage("Race added");
        setMessageBarType(MessageBarType.success);
      })
      .catch((error) => {
        setMessageBarMessage(error);
        setMessageBarType(MessageBarType.error);
      });
  };

  return (
    <Dialog
      hidden={!showDialog}
      onDismiss={onDismiss}
      dialogContentProps={contentProps}
    >
      {messageBarMessage && (
        <MessageBar
          messageBarType={messageBarType}
          styles={{
            root: {
              maxWidth: "240px",
            },
          }}
        >
          {messageBarMessage}
        </MessageBar>
      )}
      <TextField
        label="Race name"
        value={raceName}
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
