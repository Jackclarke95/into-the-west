import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  Dropdown,
  IDropdownOption,
  IModalProps,
  MessageBar,
  MessageBarType,
  Position,
  PrimaryButton,
  SpinButton,
  TextField,
} from "@fluentui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Classes from "../../Data/Classes";
import Races from "../../Data/Races";
import DataHelper from "../../Helpers/DataHelper";
import DataService from "../../Helpers/DataService";

const CharacterCreationDialog = () => {
  const dispatch = useDispatch();

  const showDialog = useSelector((state) => state.showCharacterCreationDialog);
  const currentPlayer = useSelector((state) => state.currentUser);

  const [characterName, setCharacterName] = useState<string | undefined>(
    undefined
  );
  const [characterShortName, setCharacterNickname] = useState<
    string | undefined
  >(undefined);
  const [characterRace, setCharacterRace] = useState<string | undefined>(
    undefined
  );
  const [characterSubrace, setCharacterSubrace] = useState<string | undefined>(
    undefined
  );
  const [characterLevel, setCharacterLevel] = useState<number>(1);
  const [characterClass, setCharacterClass] = useState<string | undefined>(
    undefined
  );
  const [characterSubclass, setCharacterSubclass] = useState<
    string | undefined
  >(undefined);
  const [messageBarMessage, setMessageBarMessage] = useState<
    string | undefined
  >(undefined);

  const onDismiss = () => {
    setCharacterName(undefined);
    setCharacterNickname(undefined);
    setCharacterRace(undefined);
    setCharacterSubrace(undefined);
    setCharacterLevel(1);
    setCharacterClass(undefined);
    setCharacterSubclass(undefined);

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

  const modalProps = {
    isBlocking: true,
  } as IModalProps;

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

    if (!cls || cls.archetypeDefinition.level > characterLevel) {
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

  const onChangeShortName = (_, value: string | undefined) => {
    setCharacterNickname(value);
  };

  const onChangeRace = (_, option: IDropdownOption | undefined) => {
    if (!option) {
      setCharacterRace(undefined);
    } else {
      setCharacterRace(option.text);
    }

    setCharacterSubrace(undefined);
  };

  const onChangeSubrace = (_, option: IDropdownOption | undefined) => {
    if (!option) {
      setCharacterSubrace(undefined);
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

    setCharacterSubclass(undefined);
  };

  const onChangeSubclass = (_, option: IDropdownOption | undefined) => {
    if (!option) {
      setCharacterSubclass(undefined);
    } else {
      setCharacterSubclass(option.text);
    }
  };

  const onChangeCharacterLevel = (_, value: string | undefined) => {
    if (value) {
      setCharacterLevel(parseInt(value));
    }
  };

  const onClickCreateCharacter = () => {
    console.log(validateCharacter());

    if (
      !validateCharacter() ||
      currentPlayer.isLoading ||
      !currentPlayer.data
    ) {
      console.log("invalid character");
      return;
    } else {
      console.log("creating character");

      DataService.createCharacter({
        avatarUrl: "",
        sheetUrl: "",
        playerDndBeyondName: currentPlayer.data.dndBeyondName,
        name: characterName!,
        nickname: characterShortName,
        race: characterRace!,
        subrace: characterSubrace ?? undefined,
        classes: [
          {
            name: characterClass!,
            archetype: characterSubclass ?? undefined,
            level: 1,
          },
        ],
        currentLevel: characterLevel,
        sessionsAttended: 0,
        startingLevel: characterLevel,
      });
    }

    // onDismiss();
  };

  const validateCharacter = () => {
    if (!characterName) {
      setMessageBarMessage("Please enter a name");

      return false;
    }

    if (characterName.trim().split(" ").length > 1 && !characterShortName) {
      setMessageBarMessage("Please enter a nickname");

      return false;
    }

    if (!characterRace) {
      setMessageBarMessage("Please select a race");

      return false;
    }

    if (
      Races.find((race) => race.name === characterRace)?.subraces &&
      !characterSubrace
    ) {
      setMessageBarMessage("The selected race requires a subrace");

      return false;
    }

    if (!characterClass) {
      setMessageBarMessage("Please select a class");

      return false;
    }

    const cls = Classes.find((cls) => cls.name === characterClass);

    if (
      cls &&
      !characterSubclass &&
      cls.archetypeDefinition.level <= characterLevel
    ) {
      setMessageBarMessage(
        `The selected must have ${
          DataHelper.startsWithVowel(cls.archetypeDefinition.name) ? "an" : "a"
        } ${cls.archetypeDefinition.name} at ${DataHelper.formatOrdinalNumber(
          characterLevel
        )} level`
      );

      return false;
    }

    setMessageBarMessage(undefined);

    return true;
  };

  return (
    <Dialog
      hidden={!showDialog}
      onDismiss={onDismiss}
      dialogContentProps={contentProps}
      modalProps={modalProps}
    >
      {messageBarMessage && (
        <MessageBar
          messageBarType={MessageBarType.error}
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
        label="Character Name"
        value={characterName}
        onChange={onChangeName}
        invalid={!characterName}
        required
      />
      <TextField
        label="Short name"
        value={characterShortName}
        onChange={onChangeShortName}
        disabled={
          !characterName || characterName.trim().split(" ").length === 1
        }
        required={!!characterName && characterName.trim().split(" ").length > 1}
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
        label={
          subclassOptions().length === 0
            ? "Subclass"
            : Classes.find((cls) => cls.name === characterClass)
                ?.archetypeDefinition.name
        }
        options={subclassOptions()}
        defaultValue={undefined}
        onChange={onChangeSubclass}
        disabled={subclassOptions().length === 0}
        required={subclassOptions().length !== 0}
        calloutProps={{ calloutMaxHeight: 250 }}
        selectedKey={characterSubclass}
      />
      <DialogFooter>
        <DefaultButton text="Cancel" onClick={onDismiss} />
        <PrimaryButton text="Create" onClick={onClickCreateCharacter} />
      </DialogFooter>
    </Dialog>
  );
};

export default CharacterCreationDialog;
