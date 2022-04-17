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
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Classes from "../../Data/Classes";
import Races from "../../Data/Races";
import DataService from "../../Helpers/DataService";

const CharacterCreationDialog = () => {
  const showDialog = useSelector((state) => state.showCharacterCreationDialog);

  const currentUser = useSelector((state) => state.currentUser);

  const [characterName, setCharacterName] = useState<string | undefined>(
    undefined
  );
  const [characterNickname, setCharacterNickname] = useState<
    string | undefined
  >(undefined);
  const [characterRace, setCharacterRace] = useState<string | undefined>(
    undefined
  );
  const [characterSubrace, setCharacterSubrace] = useState<
    string | undefined | null
  >(undefined);
  const [characterLevel, setCharacterLevel] = useState<number>(1);
  const [characterClass, setCharacterClass] = useState<string | undefined>(
    undefined
  );
  const [characterSubclass, setCharacterSubclass] = useState<
    string | undefined | null
  >(undefined);

  const dispatch = useDispatch();

  const onDismiss = () => {
    dispatch({
      type: "SetShowCharacterCreationDialog",
      showCharacterCreationDialog: false,
    });
  };

  const contentProps = {
    type: DialogType.largeHeader,
    title: "New character",
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

  const classOptions = Classes.map((cls) => ({
    key: cls.name,
    text: cls.name,
  }));

  const subclassOptions = () => {
    if (!characterClass) {
      return [] as IDropdownOption[];
    }

    const cls = Classes.find((cls) => cls.name === characterClass);

    if (!cls) {
      return [] as IDropdownOption[];
    }

    if (cls.archetypeDefinition.level > characterLevel) {
      return [] as IDropdownOption[];
    } else {
      return cls.archetypeDefinition.subclasses.map((subclass) => ({
        key: subclass,
        text: subclass,
      })) as IDropdownOption[];
    }
  };

  const onChangeName = (_, value: string | undefined) => {
    setCharacterName(value);
  };

  const onChangeNickname = (_, value: string | undefined) => {
    setCharacterNickname(value);
  };

  const onChangeRace = (_, option: IDropdownOption | undefined) => {
    if (!option) {
      setCharacterRace(undefined);
    } else {
      setCharacterRace(option.text);
    }

    setCharacterSubrace(null);
  };

  const onChangeSubrace = (_, option: IDropdownOption | undefined) => {
    if (!option) {
      setCharacterSubrace(null);
    } else {
      setCharacterSubrace(option.text);
    }
  };

  const onChangeClass = (_, option: IDropdownOption | undefined) => {
    if (!option) {
      setCharacterClass(undefined);
    } else {
      setCharacterClass(option.text);
    }

    setCharacterSubclass(null);
  };

  const onChangeSubclass = (_, option: IDropdownOption | undefined) => {
    if (!option) {
      setCharacterSubclass(null);
    } else {
      setCharacterSubrace(option.text);
    }
  };

  const onChangeCharacterLevel = (_, value: string | undefined) => {
    if (value) {
      setCharacterLevel(parseInt(value));
    }
  };

  const onClickCreateCharacter = () => {
    if (characterName && characterRace && characterClass && characterLevel) {
      DataService.createCharacter({
        id: Number(new Date()),
        avatarUrl: "",
        sheetUrl: "",
        playerDndBeyondName: currentUser.dndBeyondName,
        name: characterName,
        nickname: characterNickname,
        race: characterRace,
        subrace: characterSubrace ?? undefined,
        classes: [
          {
            class: {
              name: characterClass,
              archetype: undefined ?? "",
            },
            level: 1,
          },
        ],
        currentLevel: characterLevel,
        sessionsAttended: 0,
        startingLevel: characterLevel,
      });
    }

    dispatch({
      type: "SetShowCharacterCreationDialog",
      showCharacterCreationDialog: false,
    });
  };

  return (
    <Dialog
      hidden={!showDialog}
      onDismiss={onDismiss}
      dialogContentProps={contentProps}
    >
      <TextField
        label="Character Name"
        value={characterName}
        onChange={onChangeName}
        invalid={!characterName}
        required
      />
      <TextField
        label="Nickname"
        value={characterNickname}
        onChange={onChangeNickname}
        required={!!characterName && characterName.split(" ").length > 1}
      />
      <Dropdown
        label="Race"
        options={raceOptions}
        onChange={onChangeRace}
        required
        calloutProps={{ calloutMaxHeight: 500 }}
      />
      <Dropdown
        label="Subrace"
        options={subraceOptions}
        defaultValue={undefined}
        onChange={onChangeSubrace}
        disabled={subraceOptions.length === 0}
        required={subraceOptions.length !== 0}
        selectedKey={characterSubrace}
      />
      <SpinButton
        label="Level"
        onChange={onChangeCharacterLevel}
        labelPosition={Position.top}
        min={1}
        max={20}
      />
      <Dropdown
        label="Class"
        options={classOptions}
        onChange={onChangeClass}
        required
      />
      <Dropdown
        label="Subclass"
        options={subclassOptions()}
        defaultValue={undefined}
        onChange={onChangeSubclass}
        disabled={subclassOptions.length === 0}
        required={subclassOptions.length !== 0}
        calloutProps={{ calloutMaxHeight: 250 }}
        selectedKey={characterSubclass}
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

export default CharacterCreationDialog;
