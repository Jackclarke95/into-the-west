import React from "react";
import {
  Panel,
  Label,
  TextField,
  Stack,
  PrimaryButton,
  DefaultButton,
  Dropdown,
} from "@fluentui/react/";

export const CharacterCreationPanel: React.FC<{
  showCharacterCreationPanel: boolean;
  toggleCharacterCreationPanel: (shouldShow) => void;
}> = ({ showCharacterCreationPanel, toggleCharacterCreationPanel }) => {
  const onRenderFooterContent = React.useCallback(
    () => (
      <div>
        <PrimaryButton
          onClick={() => toggleCharacterCreationPanel(false)}
          text="Save"
        />
        <DefaultButton
          onClick={() => toggleCharacterCreationPanel(false)}
          text="Cancel"
        />
      </div>
    ),
    [showCharacterCreationPanel]
  );

  return (
    <Panel
      isLightDismiss
      isOpen={showCharacterCreationPanel}
      onDismiss={() => toggleCharacterCreationPanel(false)}
      closeButtonAriaLabel="Close"
      headerText="Character Creation"
      onRenderFooter={onRenderFooterContent}
      isFooterAtBottom={true}
    >
      <Label required htmlFor="character-name">
        Character name
      </Label>
      <TextField id="character-name" />
      <Label required htmlFor="character-starting-level">
        Starting Level
      </Label>
      <TextField errorMessage="Required" id="character-starting-level" />
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
      <Stack horizontal horizontalAlign="end">
        <PrimaryButton
          onClick={() => toggleCharacterCreationPanel(false)}
          text="Save"
        />
        <DefaultButton
          onClick={() => toggleCharacterCreationPanel(false)}
          text="Cancel"
        />
      </Stack>
    </Panel>
  );
};
