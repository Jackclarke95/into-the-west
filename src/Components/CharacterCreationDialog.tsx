import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  Dropdown,
  IDropdownOption,
  Position,
  PrimaryButton,
  SpinButton,
  TextField,
} from "@fluentui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Races } from "../Data/Races";
import { createCharacter } from "../Helpers/DataService";

export const CharacterCreationDialog = () => {
  const showDialog = useSelector((state) => state.showCharacterCreationDialog);
  const [characterName, setCharacterName] = useState<string | undefined>(
    undefined
  );
  const [characterNickname, setCharacterNickname] = useState<
    string | undefined
  >(undefined);
  const [characterRace, setSelectedRace] = useState<string | undefined>(
    undefined
  );
  const [characterSubrace, setCharacterSubrace] = useState<string | undefined>(
    undefined
  );
  const [characterLevel, setCharacterLevel] = useState<number>(1);

  const dispatch = useDispatch();

  const onDismiss = () => {
    dispatch({
      type: "SetShowCharacterCreationDialog",
      showCharacterCreationDialog: false,
    });
  };

  const contentProps = {
    type: DialogType.largeHeader,
    title: "Create Character",
    closeButtonAriaLabel: "Close",
  };

  const raceOptions = Races.map((race) => ({
    key: race.name,
    text: race.name,
  }));

  const subraceOptions = (
    characterRace && Races.find((race) => race.name === characterRace)?.subraces
      ? Races.find((race) => race.name === characterRace)?.subraces!.map(
          (subrace) => ({
            key: subrace,
            text: subrace,
          })
        )
      : []
  ) as IDropdownOption[];

  const onChangeName = (_, value: string | undefined) =>
    setCharacterName(value);

  const onChangeNickname = (_, value: string | undefined) =>
    setCharacterNickname(value);

  const onChangeRace = (_, option: IDropdownOption | undefined) => {
    if (!option) {
      setSelectedRace(undefined);
    } else {
      setSelectedRace(option.text);
    }
  };

  const onChangeSubrace = (_, option: IDropdownOption | undefined) => {
    if (!option) {
      setCharacterSubrace(undefined);
    } else {
      setCharacterSubrace(option.text);
    }
  };

  const onChangeCharacterLevel = (_, value: string | undefined) => {
    if (value) {
      setCharacterLevel(parseInt(value));
    }
  };

  const onValidateTextField = (value: string | undefined) => {
    if (value) {
      return;
    } else {
      return "Please enter a name";
    }
  };

  const onClickCreateCharacter = () => {
    if (characterName && characterRace && characterSubrace) {
      createCharacter({
        id: Number(new Date()),
        key: "",
        avatarUrl: "",
        sheetUrl: "",
        playerDndBeyondName: "",
        name: characterName,
        nickname: characterNickname,
        race: characterRace,
        subrace: characterSubrace,
        classes: [{ name: "Fighter", level: 1, archetype: undefined }],
        currentLevel: characterLevel,
        sessionsAttended: 0,
        startingLevel: characterLevel,
      });
    }
  };

  console.log("new character", {
    name: characterName,
    nickname: characterNickname,
    race: characterRace,
    subrace: characterSubrace,
    startingLevel: characterLevel,
  });

  return (
    <Dialog
      hidden={!showDialog}
      onDismiss={onDismiss}
      dialogContentProps={contentProps}
    >
      <TextField
        label="Name"
        value={characterName}
        onChange={onChangeName}
        invalid={!characterName}
        required
        validateOnLoad={false}
        validateOnFocusOut={true}
        onGetErrorMessage={onValidateTextField}
      />
      <TextField
        label="Nickname"
        value={characterNickname}
        onChange={onChangeNickname}
        validateOnLoad={false}
        validateOnFocusOut={true}
        onGetErrorMessage={onValidateTextField}
      />
      <Dropdown
        label="Select a Race"
        options={raceOptions}
        defaultValue={undefined}
        onChange={onChangeRace}
        required
      />
      <Dropdown
        label="Select a Subrace"
        options={subraceOptions}
        defaultValue={undefined}
        onChange={onChangeSubrace}
        disabled={subraceOptions.length === 0}
        required={subraceOptions.length !== 0}
      />
      <SpinButton
        label="Level"
        onChange={onChangeCharacterLevel}
        labelPosition={Position.top}
        min={1}
        max={20}
      />

      <DialogFooter>
        <DefaultButton text="Cancel" onClick={onDismiss}></DefaultButton>
        <PrimaryButton
          text="Create"
          onClick={onClickCreateCharacter}
        ></PrimaryButton>
      </DialogFooter>
    </Dialog>
  );
};
