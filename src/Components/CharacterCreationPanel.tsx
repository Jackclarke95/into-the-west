import React, { ReactNode, useState } from "react";
import {
  Panel,
  Label,
  TextField,
  Stack,
  PrimaryButton,
  DefaultButton,
  Dropdown,
  MessageBar,
  MessageBarType,
  IDropdownOption,
  setVirtualParent,
  SpinButton,
} from "@fluentui/react/";
import ICharacterClass from "../Interfaces/ICharacterClass";

export const CharacterCreationPanel: React.FC<{
  shouldShowCharacterCreationPanel: boolean;
  toggleCharacterCreationPanel: (shouldShow) => void;
}> = ({ shouldShowCharacterCreationPanel, toggleCharacterCreationPanel }) => {
  const [name, setName] = React.useState("");
  const [classCount, setClassCount] = React.useState(1);
  const [startingLevel, setStartingLevel] = React.useState(1);
  const [characterClasses, setCharacterClass] = React.useState<
    ICharacterClass[]
  >([] as ICharacterClass[]);
  const [errorMessage, setErrorMessage] = React.useState("");

  const onRenderFooterContent = React.useCallback(
    () => (
      <Stack
        horizontal
        style={{
          paddingLeft: "24px",
          paddingRight: "24px",
          paddingBottom: "20px",
        }}
        tokens={{ childrenGap: 10 }}
      >
        <PrimaryButton
          onClick={() => toggleCharacterCreationPanel(false)}
          text="Save"
        />
        <DefaultButton
          onClick={() => toggleCharacterCreationPanel(false)}
          text="Cancel"
        />
      </Stack>
    ),
    []
  );

  const onChangeCharacterClass = (
    item: IDropdownOption<any> | undefined,
    level: number | undefined
  ) => {
    // const newClass = item.value
    // const allClasses = characterClasses as ICharacterClass[];
    // setCharacterClass([
    //   ...allClasses.filter((cls) => cls.class. != item.value),
    //   item.key, ,
    // ]);
  };

  const LevelPicker = () => {
    const [characterClass, setCharacterClass] = useState("");
    const [ClassLevel, SetClassLevel] = useState<number | undefined>(1);

    const onChangeLevel = React.useCallback(
      (_event: any, newValue?: string | undefined) => {
        if (!newValue) {
          alert("Please enter a valid level");

          return;
        }

        let level = 0;

        try {
          level = parseInt(newValue);
        } catch (e) {
          alert(e);
        }

        SetClassLevel(level);
      },
      []
    );

    const levelPicker = [] as ReactNode[];

    for (let i = 1; i <= startingLevel; i++) {
      levelPicker.push(
        <Stack horizontal>
          <Dropdown
            placeholder="Select a Class"
            label="Class"
            onChange={(_event, item) =>
              onChangeCharacterClass(item, ClassLevel)
            }
            options={[
              { key: "artificer", text: "Artificer" },
              { key: "barbarian", text: "Barbarian" },
              { key: "bard", text: "Bard" },
              { key: "cleric", text: "Cleric" },
              { key: "druid", text: "Druid" },
              { key: "fighter", text: "Fighter" },
              { key: "monk", text: "Monk" },
              { key: "paladin", text: "Paladin" },
              { key: "ranger", text: "Ranger" },
              { key: "rogue", text: "Rogue" },
              { key: "sorcerer", text: "Sorcerer" },
              { key: "warlock", text: "Warlock" },
              { key: "wizard", text: "Wizard" },
            ]}
          />
          <SpinButton defaultValue="Starting level" onChange={onChangeLevel} />
        </Stack>
      );
    }
  };

  const onAddClass = () => {
    if (classCount === startingLevel) {
      setErrorMessage("You can't have more classes than starting levels");

      return;
    }

    setClassCount(classCount + 1);
  };

  const onChangeName = React.useCallback(
    (
      _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      setName(newValue || "");
    },
    []
  );

  return (
    <Panel
      isLightDismiss
      isOpen={shouldShowCharacterCreationPanel}
      onDismiss={() => toggleCharacterCreationPanel(false)}
      closeButtonAriaLabel="Close"
      headerText="Character Creation"
      onRenderFooter={onRenderFooterContent}
      isFooterAtBottom={true}
    >
      {errorMessage && (
        <MessageBar messageBarType={MessageBarType.error}>
          {errorMessage}
        </MessageBar>
      )}
      <Label required htmlFor="character-name">
        Character name
      </Label>
      <TextField value={name} onChange={onChangeName} id="character-name" />
      <Label required htmlFor="character-starting-level">
        Starting Level
      </Label>
      {LevelPicker()}
      <PrimaryButton
        text="Upload Avatar"
        iconProps={{ iconName: "Upload" }}
        onClick={(ev?) => {
          ev?.persist();

          Promise.resolve().then(() => {
            const inputElement = document.createElement("input");
            inputElement.style.visibility = "hidden";
            inputElement.setAttribute("type", "file");

            document.body.appendChild(inputElement);

            const target = ev?.target as HTMLElement | undefined;

            if (target) {
              setVirtualParent(inputElement, target);
            }

            inputElement.click();

            if (target) {
              setVirtualParent(inputElement, null);
            }

            setTimeout(() => {
              inputElement.remove();
            }, 10000);
          });
        }}
      />
    </Panel>
  );
};
