import React, { useEffect, useState } from "react";
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
import { CharacterPicker } from "./CharacterPicker";
import ISessionData from "../Interfaces/ISessionData";
import { createSession } from "../Helpers/DatabaseHandler";

export const NewSessionPanel: React.FC<{}> = () => {
  const dispatch = useDispatch();

  const characters = useSelector((state) => state.characters);

  const showNewSessionPanel = useSelector((state) => state.showNewSessionPanel);
  const [sessionName, setSessionName] = useState<string>("");
  const [sessionDate, setSessionDate] = useState<string>("");
  const [sessionCharacterIds, setSelectedCharacterIds] = useState<number[]>([]);
  const [sessionMap, setSelectedMap] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [session, setSession] = useState<ISessionData | null>(null);

  useEffect(() => {
    setSession({
      characters: [...sessionCharacterIds],
      id: new Date().getTime() as number,
      name: sessionName,
      ["scheduled-date"]: sessionDate,
      ["dungeon-master"]: "",
    });
  }, [sessionName, sessionDate, sessionCharacterIds, sessionMap]);

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

  const onSave = () => {
    console.log("session", session);

    if (session) {
      createSession(session);
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
        <DefaultButton onClick={() => dismissnewSessionPanel()} text="Cancel" />
      </Stack>
    ),
    []
  );

  const onChangeMap = (
    _: React.FormEvent<HTMLDivElement>,
    item?: IDropdownOption
  ): void => {
    setSelectedMap(item!.text);
  };

  console.log("state session", session);

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
      <Label required htmlFor="session-sessions">
        Characters
      </Label>
      <CharacterPicker setSelectedCharacterIds={setSelectedCharacterIds} />
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
