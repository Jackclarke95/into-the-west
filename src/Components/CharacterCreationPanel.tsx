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
  shouldShowCharacterCreationPanel: boolean;
  toggleCharacterCreationPanel: (shouldShow) => void;
}> = ({ shouldShowCharacterCreationPanel, toggleCharacterCreationPanel }) => {
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
    </Panel>
  );
};
