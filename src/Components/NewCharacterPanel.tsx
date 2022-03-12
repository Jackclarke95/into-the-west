import React, { ReactNode, useEffect, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { createCharacter } from "../Helpers/DataService";
import ICharacterData from "../Interfaces/ICharacterData";

export const NewCharacterPanel: React.FC<{}> = () => {
  const dispatch = useDispatch();

  const showNewCharacterPanel = useSelector(
    (state) => state.showNewCharacterPanel
  );

  const [characterToCreate, setCharacterToCreate] = useState<
    ICharacterData | undefined
  >(undefined);
  const [name, setName] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const toggleCharacterCreationPanel = () => {
    dispatch({
      type: "SetShowNewCharacterPanel",
      showNewCharacterPanel: !showNewCharacterPanel,
    });
  };

  const onSave = () => {
    if (characterToCreate) {
      createCharacter(characterToCreate);

      toggleCharacterCreationPanel();
    }
  };

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
        <PrimaryButton onClick={() => onSave()} text="Save" />
        <DefaultButton
          onClick={() => toggleCharacterCreationPanel()}
          text="Cancel"
        />
      </Stack>
    ),
    []
  );

  useEffect(() => {
    console.log("name:", name);
  }, [name]);

  useEffect(() => {
    const toCreate = {
      id: new Date().getTime() as number,
      race: "test race",
      name: name,
      classes: [{ class: "Fighter", level: 6 }],
      ["starting-level"]: 5,
      ["player-dndbeyond-name"]: "JackClarke",
      nickname: "nickname",
      subrace: "test subrace",
      retirement: null,
    } as ICharacterData;

    setCharacterToCreate(toCreate);
  });

  return (
    <Panel
      isLightDismiss
      isOpen={showNewCharacterPanel}
      onDismiss={() => toggleCharacterCreationPanel()}
      closeButtonAriaLabel="Close"
      headerText="New Character"
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
      <TextField
        value={name}
        onChange={(_, newValue) => setName(newValue?.toString() ?? "")}
        id="character-name"
      />
    </Panel>
  );
};
