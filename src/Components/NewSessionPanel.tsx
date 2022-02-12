import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Panel,
  Label,
  TextField,
  Stack,
  PrimaryButton,
  DefaultButton,
  MessageBar,
  MessageBarType,
  DatePicker,
  DayOfWeek,
  Dropdown,
  IDropdownOption,
} from "@fluentui/react/";
import { formatDate } from "../Helpers/DataParser";

export const NewSessionPanel: React.FC<{}> = () => {
  const dispatch = useDispatch();

  const characters = useSelector((state) => state.characters);

  const showNewSessionPanel = useSelector((state) => state.showNewSessionPanel);
  const [sessionName, setSessionName] = useState<string>("");
  const [sessionDate, setSessionDate] = useState<Date | null | undefined>();
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>(
    []
  );
  const [selectedMap, setSelectedMap] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const onChangeName = React.useCallback(
    (
      _event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
      newValue?: string
    ) => {
      setSessionName(newValue || "");
    },
    []
  );

  const dismissnewSessionPanel = () => {
    dispatch({
      type: "SetShowNewSessionPanel",
      showNewSessionPanel: !showNewSessionPanel,
    });
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
        <PrimaryButton onClick={() => dismissnewSessionPanel()} text="Save" />
        <DefaultButton onClick={() => dismissnewSessionPanel()} text="Cancel" />
      </Stack>
    ),
    []
  );

  const onChangeCharacters = (
    _: React.FormEvent<HTMLDivElement>,
    item?: IDropdownOption
  ): void => {
    setSelectedCharacterIds(
      item!.selected
        ? [...selectedCharacterIds, item!.key as string]
        : selectedCharacterIds.filter((key) => key !== item!.key)
    );
  };

  const onChangeMap = (
    _: React.FormEvent<HTMLDivElement>,
    item?: IDropdownOption
  ): void => {
    setSelectedMap(item!.text);
  };

  console.log("characters", selectedCharacterIds);
  console.log("date:", sessionDate);
  console.log("map:", selectedMap);

  return (
    <Panel
      isLightDismiss
      isOpen={showNewSessionPanel}
      onDismiss={() => dismissnewSessionPanel()}
      closeButtonAriaLabel="Close"
      headerText="New Session"
      onRenderFooter={onRenderFooterContent}
      isFooterAtBottom={true}
    >
      {errorMessage && (
        <MessageBar messageBarType={MessageBarType.error}>
          {errorMessage}
        </MessageBar>
      )}
      <Label required htmlFor="session-name">
        Session Name
      </Label>
      <TextField
        value={sessionName}
        onChange={onChangeName}
        id="session-name"
      />
      <Label required htmlFor="session-date">
        Date
      </Label>
      <DatePicker
        firstDayOfWeek={DayOfWeek.Monday}
        placeholder="Select a date..."
        ariaLabel="Select a date"
        onSelectDate={(date) => setSessionDate(formatDate(date, "yyyy MM dd"))}
      />
      <Dropdown
        placeholder="Select characters"
        label="Characters"
        // multiSelect
        options={characters.map((character) => ({
          key: character.id,
          text: character.name,
        }))}
        onChange={onChangeCharacters}
      />
      <Dropdown
        placeholder="Select Map"
        label="Map"
        options={[
          { key: 1, text: "The Everwilds" },
          { key: 2, text: "The Forgotten Lands" },
          { key: 3, text: "The Lunar Isles" },
          { key: 4, text: "The Shattered Realm" },
        ]}
        onChange={onChangeMap}
      />
    </Panel>
  );
};
