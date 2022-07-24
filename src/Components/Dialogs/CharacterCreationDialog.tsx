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
  PrimaryButton,
  TextField,
} from "@fluentui/react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataHelper from "../../Helpers/DataHelper";

const CharacterCreationDialog = () => {
  const dispatch = useDispatch();

  const showDialog = useSelector((state) => state.showCharacterCreationDialog);
  const classes = useSelector((state) => state.classes);
  const subclasses = useSelector((state) => state.subclasses);
  const classConfigs = useSelector((state) => state.classConfigs);
  const races = useSelector((state) => state.races);
  const subraces = useSelector((state) => state.subraces);
  const raceConfigs = useSelector((state) => state.raceConfigs);

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

  const raceOptions = races.isLoading
    ? []
    : races.data.map((race) => ({
        key: race.name,
        text: race.name,
      }));

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

  const onClickCreateCharacter = () => {
    console.log(validateCharacter());
  };

  const validateCharacter = () => {
    if (
      classes.isLoading ||
      subclasses.isLoading ||
      classConfigs.isLoading ||
      races.isLoading ||
      subraces.isLoading ||
      raceConfigs.isLoading
    ) {
      setMessageBarMessage("Data still loading");

      return;
    }

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
      races.data.find((race) => race.name === characterRace)?.subraceRequired &&
      !characterSubrace
    ) {
      setMessageBarMessage("The selected race requires a subrace");

      return false;
    }

    if (!characterClass) {
      setMessageBarMessage("Please select a class");

      return false;
    }

    const cls = classes.data.find((cls) => cls.name === characterClass);

    if (cls && !characterSubclass && cls.levelFrom <= characterLevel) {
      setMessageBarMessage(
        `The selected archetype must have ${
          DataHelper.startsWithVowel(cls.archetypeName) ? "an" : "a"
        } ${cls.archetypeName} at ${DataHelper.formatOrdinalNumber(
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
        label="Character name"
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
      {/* <Dropdown
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
      /> */}
      {/* <Dropdown
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
      /> */}
      <DialogFooter>
        <DefaultButton text="Cancel" onClick={onDismiss} />
        <PrimaryButton text="Create" onClick={onClickCreateCharacter} />
      </DialogFooter>
    </Dialog>
  );
};

export default CharacterCreationDialog;
