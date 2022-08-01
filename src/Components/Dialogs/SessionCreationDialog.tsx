import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  Dropdown,
  IDropdownOption,
  PrimaryButton,
  TextField,
  TooltipHost,
} from "@fluentui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataService from "../../Helpers/DataService";
import { Map } from "../../Types/LocalStructures";

const SessionCreationDialog = () => {
  const showDialog = useSelector((state) => state.showSessionCreationDialog);
  const maps = useSelector((state) => state.maps);
  const currentPlayer = useSelector((state) => state.currentPlayer);

  const [sessionName, setSessionName] = useState<string | undefined>(undefined);

  const [sessionMap, setSessionMap] = useState<Map | undefined>(undefined);

  const dispatch = useDispatch();

  const onChangeSessionName = (_, value: string | undefined) => {
    setSessionName(value);
  };

  const onChangeMap = (_, option: IDropdownOption | undefined) => {
    if (!option || maps.isLoading) {
      setSessionMap(undefined);
    } else {
      const matchingMap = maps.data.find((map) => map.id === option.key);

      setSessionMap(matchingMap);
    }
  };

  const onDismiss = () => {
    setSessionName(undefined);
    setSessionMap(undefined);

    dispatch({
      type: "SetShowSessionCreationDialog",
      showSessionCreationDialog: false,
    });
  };

  const onClickAddSession = async () => {
    if (
      !sessionName ||
      sessionName.length === 0 ||
      !sessionMap ||
      currentPlayer.isLoading ||
      !currentPlayer.data
    ) {
      return;
    }

    await DataService.createSession(
      sessionName,
      sessionMap,
      currentPlayer.data
    );

    onDismiss();
  };

  const mapOptions = maps.isLoading
    ? []
    : (maps.data
        .map((map) => ({
          key: map.id,
          text: map.name,
        }))
        .sort((optionA, optionB) =>
          optionA.text.localeCompare(optionB.text)
        ) as IDropdownOption[]);

  const contentProps = {
    type: DialogType.largeHeader,
    title: "New session",
    closeButtonAriaLabel: "Close",
  };

  const getRegisterDisabledTooltipContent = () => {
    if (sessionName?.length === 0) {
      return "Session name required to continue.";
    }

    if (!sessionMap) {
      return "Please select a Map to continue.";
    }
  };

  return (
    <Dialog
      hidden={!showDialog}
      onDismiss={onDismiss}
      dialogContentProps={contentProps}
    >
      <TextField
        label="Session name"
        value={sessionName}
        onChange={onChangeSessionName}
        required
      />
      <Dropdown
        label="Map"
        options={mapOptions}
        onChange={onChangeMap}
        required
      />
      <DialogFooter>
        <DefaultButton text="Cancel" onClick={onDismiss} />
        <TooltipHost content={getRegisterDisabledTooltipContent()}>
          <PrimaryButton
            text="Create"
            onClick={onClickAddSession}
            disabled={sessionName?.length === 0 || !sessionMap}
          />
        </TooltipHost>
      </DialogFooter>
    </Dialog>
  );
};

export default SessionCreationDialog;
