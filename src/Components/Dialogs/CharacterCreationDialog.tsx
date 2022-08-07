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
import {
  ClassData,
  RaceData,
  SubclassData,
  SubraceData,
} from "../../Types/DatabaseStructures";

const CharacterCreationDialog = () => {
  const dispatch = useDispatch();

  const showDialog = useSelector((state) => state.showCharacterCreationDialog);
  const classes = useSelector((state) => state.classes);
  const subclasses = useSelector((state) => state.subclasses);
  const classConfigs = useSelector((state) => state.classConfigs);
  const races = useSelector((state) => state.races);
  const subraces = useSelector((state) => state.subraces);
  const raceConfigs = useSelector((state) => state.raceConfigs);

  const [messageBarMessage, setMessageBarMessage] = useState<
    string | undefined
  >(undefined);

  const [characterName, setCharacterName] = useState<string | undefined>(
    undefined
  );
  const [characterShortName, setCharacterNickname] = useState<
    string | undefined
  >(undefined);

  const [selectedRace, setSelectedRace] = useState<RaceData | undefined>(
    undefined
  );
  const [selectedSubrace, setSelectedSubrace] = useState<
    SubraceData | undefined
  >(undefined);

  const [selectedClass, setSelectedClass] = useState<ClassData | undefined>(
    undefined
  );
  const [selectedSubclass, setSelectedSubclass] = useState<
    SubclassData | undefined
  >(undefined);

  const [selectableSubraces, setSelectableSubraces] = useState<SubraceData[]>(
    []
  );
  const [selectableSubclasses, setSelectableSubclasses] = useState<
    SubclassData[]
  >([]);

  const onDismiss = () => {
    setCharacterName(undefined);
    setCharacterNickname(undefined);

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

  const raceOptions: IDropdownOption[] = races.isLoading
    ? []
    : races.data
        .map((race) => ({
          key: race.key,
          text: race.name,
        }))
        .sort((raceA, raceB) => raceA.text.localeCompare(raceB.text));

  const subraceOptions: IDropdownOption[] = selectableSubraces.map(
    (subrace) => ({ key: subrace.key, text: subrace.name })
  );

  const classOptions: IDropdownOption[] = classes.isLoading
    ? []
    : classes.data
        .map((cls) => ({
          key: cls.key,
          text: cls.name,
        }))
        .sort((classA, classB) => classA.text.localeCompare(classB.text));

  const subclassOptions: IDropdownOption[] = selectableSubclasses.map(
    (subclass) => ({ key: subclass.key, text: subclass.subclassName })
  );

  const onChangeName = (_, value: string | undefined) => {
    setCharacterName(value);
  };

  const onChangeShortName = (_, value: string | undefined) => {
    setCharacterNickname(value);
  };

  const onChangeRace = (_, option: IDropdownOption | undefined) => {
    console.log("changing race", option);
    if (
      races.isLoading ||
      subraces.isLoading ||
      raceConfigs.isLoading ||
      !option
    ) {
      return;
    }

    const race = races.data.find((race) => race.key === option.key);

    const subracesToSetSelectable = raceConfigs.data
      .filter((config) => config.raceId === race?.key && config.subraceId)
      .map((config) => {
        const subrace = subraces.data.find(
          (subrace) => subrace.key === config.subraceId
        );

        if (!subrace) {
          throw new Error(
            `Could not find subrace with ID "${config.subraceId}" from RaceConfig with ID "${config.key}"`
          );
        }

        return subrace;
      })
      .sort((a, b) => b.name.localeCompare(a.name));

    console.log(race);
    console.log(subraces);

    setSelectedRace(race);

    if (!race?.subraceRequired && subracesToSetSelectable.length > 0) {
      subracesToSetSelectable.push({
        key: "NO_RACE_REQUIRED",
        name: "~No Subrace~",
      });
    }

    setSelectableSubraces(subracesToSetSelectable.reverse());
  };

  const onChangeSubrace = (_, option: IDropdownOption | undefined) => {
    if (subraces.isLoading) {
      return;
    }

    const subrace = subraces.data.find(
      (subrace) => subrace.key === option?.key
    );

    setSelectedSubrace(subrace);
  };

  const onChangeClass = (_, option: IDropdownOption | undefined) => {
    console.log("changing class", option);

    if (
      classes.isLoading ||
      subclasses.isLoading ||
      classConfigs.isLoading ||
      !option
    ) {
      return;
    }

    const cls = classes.data.find((cls) => cls.key === option.key);

    const subclassesToSetSelectable = classConfigs.data
      .filter((config) => config.classId === cls?.key)
      .map((config) => {
        const subclass = subclasses.data.find(
          (subclass) => subclass.key === config.subclassId && config.subclassId
        );

        if (!subclass) {
          throw new Error(
            `Could not find subclass with ID "${config.subclassId}" from RaceConfig with ID "${config.key}"`
          );
        }

        return subclass;
      })
      .sort((a, b) => b.subclassName.localeCompare(a.subclassName));

    console.log(cls);
    console.log(subraces);

    setSelectedClass(cls);

    setSelectableSubclasses(subclassesToSetSelectable);
  };

  const onChangeSubclass = (_, option: IDropdownOption | undefined) => {
    if (subclasses.isLoading) {
      return;
    }

    const subclass = subclasses.data.find(
      (subclass) => subclass.key === option?.key
    );

    setSelectedSubclass(subclass);
  };

  const onClickCreateCharacter = () => {
    console.log("creating character");
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
      <Dropdown label="Race" options={raceOptions} onChange={onChangeRace} />
      <Dropdown
        label="Subrace"
        options={subraceOptions}
        onChange={onChangeSubrace}
        disabled={subraceOptions.length === 0}
        required={selectedRace?.subraceRequired}
      />
      <Dropdown label="Class" options={classOptions} onChange={onChangeClass} />
      <Dropdown
        label="Subclass"
        options={subclassOptions}
        onChange={onChangeSubclass}
        disabled={subclassOptions.length === 0}
      />
      <DialogFooter>
        <DefaultButton text="Cancel" onClick={onDismiss} />
        <PrimaryButton text="Create" onClick={onClickCreateCharacter} />
      </DialogFooter>
    </Dialog>
  );
};

export default CharacterCreationDialog;
