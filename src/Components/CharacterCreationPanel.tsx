import React from "react";
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
} from "@fluentui/react/";

export const CharacterCreationPanel: React.FC<{
  shouldShowCharacterCreationPanel: boolean;
  toggleCharacterCreationPanel: (shouldShow) => void;
}> = ({ shouldShowCharacterCreationPanel, toggleCharacterCreationPanel }) => {
  const [name, setName] = React.useState("");
  const [classCount, setClassCount] = React.useState(1);
  const [startingLevel, setStartingLevel] = React.useState(1);
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
    [shouldShowCharacterCreationPanel]
  );

  const onAddClass = () => {
    if (classCount === startingLevel) {
      setErrorMessage("You can't have more classes than starting levels");

      return;
    }

    setClassCount(classCount + 1);
  };

  const onChangeName = React.useCallback(
    (
      event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      setName(newValue || "");
    },
    []
  );

  console.log(name);

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
      <TextField errorMessage="" id="character-starting-level" />
      <Dropdown
        placeholder="Select a Class"
        label="Class"
        options={[
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
    </Panel>
  );
};
