import {
  DatePicker,
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  Dropdown,
  IDropdownOption,
  IInputProps,
  IPersonaProps,
  Label,
  MessageBar,
  MessageBarType,
  NormalPeoplePicker,
  PrimaryButton,
  TextField,
} from "@fluentui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataService from "../../Helpers/DataService";

const SessionCreationDialog = () => {
  const showDialog = useSelector((state) => state.showSessionCreationDialog);
  const players = useSelector((state) => state.players);
  const characters = useSelector((state) => state.characters);

  const [sessionName, setSessionName] = useState<string | undefined>(undefined);
  const [sessionDate, setSessionDate] = useState<Date | null | undefined>(
    undefined
  );
  const [sessionDungeonMaster, setSessionDungeonMaster] = useState<
    string | undefined
  >(undefined);
  const [sessionMap, setSessionMap] = useState<string | undefined>(undefined);
  const [sessionAttendees, setSessionAttendees] = useState<IPersonaProps[]>([]);
  const [errorList, setErrorList] = useState<string[]>([]);

  const dispatch = useDispatch();

  const onChangeSessionName = (_, value: string | undefined) => {
    setSessionName(value);
  };

  const onSelectDate = (value: Date | null | undefined) => {
    setSessionDate(value);
  };

  const onChangeDungeonMaster = (_, option: IDropdownOption | undefined) => {
    if (!option) {
      setSessionDungeonMaster(undefined);
    } else {
      setSessionDungeonMaster(option.text);
    }
  };

  const onChangeMap = (_, option: IDropdownOption | undefined) => {
    if (!option) {
      setSessionMap(undefined);
    } else {
      setSessionMap(option.text);
    }
  };

  const onChangeAttendees = (items: IPersonaProps[] | undefined) => {
    if (!items) {
      setSessionAttendees([]);
    } else {
      setSessionAttendees(items);
    }
  };

  const onDismiss = () => {
    setSessionName(undefined);
    setSessionDate(undefined);
    setSessionDungeonMaster(undefined);
    setSessionMap(undefined);
    setSessionAttendees([]);

    dispatch({
      type: "SetShowSessionCreationDialog",
      showSessionCreationDialog: false,
    });
  };

  const onClickAddSession = () => {
    const attendees = sessionAttendees
      .filter((attendee) => attendee)
      .map((attendee) => {
        return attendee.key?.toString();
      })
      .filter((key) => key !== undefined) as string[];

    if (!sessionName) {
      setErrorList([...errorList, "Session name is required"]);
    }

    if (!sessionDungeonMaster) {
      setErrorList([...errorList, "Dungeon master is required"]);
    }

    if (!sessionMap) {
      setErrorList([...errorList, "Map is required"]);
    }

    if (attendees.length === 0) {
      setErrorList([...errorList, "At least one attendee is required"]);
    }

    if (
      !sessionName ||
      !sessionDungeonMaster ||
      !sessionMap ||
      !attendees ||
      attendees.length === 0
    ) {
      return;
    }

    DataService.createSession({
      name: sessionName,
      date: sessionDate ? sessionDate.toDateString() : undefined,
      dungeonMaster: sessionDungeonMaster,
      map: sessionMap,
      attendees,
    });

    dispatch({
      type: "SetShowSessionCreationDialog",
      showSessionCreationDialog: false,
    });
  };

  const dungeonMasterOptions = players.isLoading
    ? ([] as IDropdownOption[])
    : (players.data
        .filter((player) => player.isDungeonMaster)
        .sort((playerA, playerB) => playerA.name.localeCompare(playerB.name))
        .map((player) => ({
          key: player.dndBeyondName,
          text: player.name,
        })) as IDropdownOption[]);

  const mapOptions = [
    {
      key: "the-everwilds",
      text: "The Everwilds",
    },
    {
      key: "the-forgotten-lands",
      text: "The Forgotten Lands",
    },
    {
      key: "the-shattered-realms",
      text: "The Shattered Realms",
    },
    {
      key: "the-lunar-isles",
      text: "The Lunar Isles",
    },
  ].sort((optionA, optionB) =>
    optionA.text.localeCompare(optionB.text)
  ) as IDropdownOption[];

  const onResolveSuggestions = (
    filter: string,
    selectedItems?: IPersonaProps[]
  ) => {
    if (characters.isLoading) {
      return [] as IPersonaProps[];
    }

    return characters.data
      .filter(
        (character) =>
          !character.retirement &&
          character.name.toLowerCase().includes(filter.toLowerCase()) &&
          !selectedItems?.find((item) => item.text === character.name)
      )
      .map((character) => ({
        key: character.key,
        text: character.name,
        imageUrl: character.avatarUrl,
      })) as IPersonaProps[];
  };

  const onResolveEmptySuggestions = (selectedItems?: IPersonaProps[]) => {
    if (characters.isLoading) {
      return [] as IPersonaProps[];
    }

    return characters.data
      .filter(
        (character) =>
          !character.retirement &&
          !selectedItems?.find((item) => item.text === character.name)
      )
      .map((character) => ({
        key: character.key,
        text: character.name,
        imageUrl: character.avatarUrl,
      })) as IPersonaProps[];
  };

  const inputProps = {
    placeholder: "Search for a character",
  } as IInputProps;

  const contentProps = {
    type: DialogType.largeHeader,
    title: "New session",
    closeButtonAriaLabel: "Close",
  };

  return (
    <Dialog
      hidden={!showDialog}
      onDismiss={onDismiss}
      dialogContentProps={contentProps}
    >
      {errorList.length > 0 && (
        <MessageBar
          isMultiline
          messageBarType={MessageBarType.error}
          styles={{
            root: {
              maxWidth: "240px",
            },
          }}
        >
          {errorList.join("-")}
        </MessageBar>
      )}
      <TextField
        label="Session name"
        value={sessionName}
        onChange={onChangeSessionName}
      />
      <DatePicker
        label="Session Date"
        minDate={new Date()}
        onSelectDate={onSelectDate}
      />
      <Dropdown
        label="Dungeon Master"
        options={dungeonMasterOptions}
        onChange={onChangeDungeonMaster}
      />
      <Dropdown label="Map" options={mapOptions} onChange={onChangeMap} />
      <Label>Characters</Label>
      <NormalPeoplePicker
        onResolveSuggestions={onResolveSuggestions}
        onEmptyResolveSuggestions={onResolveEmptySuggestions}
        inputProps={inputProps}
        onChange={onChangeAttendees}
      />
      <DialogFooter>
        <DefaultButton text="Cancel" onClick={onDismiss} />
        <PrimaryButton text="Create" onClick={onClickAddSession} />
      </DialogFooter>
    </Dialog>
  );
};

export default SessionCreationDialog;
