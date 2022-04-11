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
  NormalPeoplePicker,
  PrimaryButton,
  TextField,
} from "@fluentui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const SessionCreationDialog = () => {
  const showDialog = useSelector((state) => state.showSessionCreationDialog);
  const players = useSelector((state) => state.players);
  const characters = useSelector((state) => state.characters);

  const [sessionName, setSessionName] = useState<string | undefined>(undefined);
  const [sessionDate, setSessionDate] = useState<Date | null | undefined>(
    undefined
  );

  const dispatch = useDispatch();

  const onChangeSessionName = (_, value: string | undefined) => {
    setSessionName(value);
  };

  const onSelectDate = (value: Date | null | undefined) => {
    setSessionDate(value);
  };

  const onDismiss = () => {
    dispatch({
      type: "SetShowSessionCreationDialog",
      showSessionCreationDialog: false,
    });
  };

  const onClickAddSession = () => {
    console.log("creating session");
  };

  const dungeonMasterOptions = players.isLoading
    ? ([] as IDropdownOption[])
    : (players.data
        .filter((player) => player.isDungeonMaster)
        .sort((playerA, playerB) =>
          playerA.friendlyName.localeCompare(playerB.friendlyName)
        )
        .map((player) => ({
          key: player.dndBeyondName,
          text: player.friendlyName,
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
          character.name.toLowerCase().includes(filter.toLowerCase()) &&
          !selectedItems?.find((item) => item.text === character.name)
      )
      .map((character) => ({
        key: character.name,
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
          !selectedItems?.find((item) => item.text === character.name)
      )
      .map((character) => ({
        key: character.name,
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
      <DialogFooter>
        <TextField
          label="Session name"
          value={sessionName}
          onChange={onChangeSessionName}
        />
        <DatePicker label="Session Date" onSelectDate={onSelectDate} />
        <Dropdown label="Dungeon Master" options={dungeonMasterOptions} />
        <Dropdown label="Map" options={mapOptions} />
        <Label>Characters</Label>
        <NormalPeoplePicker
          onResolveSuggestions={onResolveSuggestions}
          onEmptyResolveSuggestions={onResolveEmptySuggestions}
          inputProps={inputProps}
        />
        <DefaultButton text="Cancel" onClick={onDismiss}></DefaultButton>
        <PrimaryButton
          text="Create"
          onClick={onClickAddSession}
        ></PrimaryButton>
      </DialogFooter>
    </Dialog>
  );
};

export default SessionCreationDialog;
