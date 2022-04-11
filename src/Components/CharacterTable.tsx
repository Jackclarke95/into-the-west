import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DefaultSpacing,
  IColumn,
  Image,
  ImageFit,
  Link,
  PrimaryButton,
  SelectionMode,
  ShimmeredDetailsList,
  Stack,
  Text,
  Toggle,
} from "@fluentui/react";
import { ClassIcon } from "./ClassIcon";
import DefaultAvatar from "../Images/DefaultAvatar.jpeg";
import ICharacterData from "../Interfaces/ICharacterData";
import LevelUpTable from "../Data/LevelUp";
import DataHelper from "../Helpers/DataHelper";

const CharacterTable = () => {
  const characterData = useSelector((state) => state.characters);
  const sessionData = useSelector((state) => state.sessions);
  const isDevMode = useSelector((state) => state.isDevMode);

  const [compactMode, setCompactMode] = React.useState(false);

  const dispatch = useDispatch();

  let activeCharacters = [] as ICharacterData[];
  let retiredCharacters = [] as ICharacterData[];

  if (!characterData.isLoading) {
    activeCharacters = characterData.data.filter(
      (character) => !character.retirement
    );

    retiredCharacters = characterData.data.filter(
      (character) => character.retirement
    );
  }

  const onRenderAvatar = (character: ICharacterData) => (
    <Image
      src={character.avatarUrl.length > 0 ? character.avatarUrl : DefaultAvatar}
      imageFit={ImageFit.cover}
      styles={{
        root: {
          borderRadius: "50%",
          height: "20px",
          width: "20px",
          filter:
            character.avatarUrl === ""
              ? `hue-rotate(${
                  Math.random() * 360
                }deg) brightness(1.5) invert(100%) ${
                  character.retirement ? `grayscale(100%) brightness(0.5)` : ""
                }`
              : undefined,
        },
      }}
    />
  );

  const onRenderName = (character: ICharacterData) =>
    character.sheetUrl ? (
      <Link target="_blank" href={character.sheetUrl}>
        {character.name}
      </Link>
    ) : (
      <span>{character.name}</span>
    );

  const onRenderRace = (character: ICharacterData) =>
    character.subrace
      ? `${character.subrace} ${character.race}`
      : character.race;

  const onRenderClasses = (character: ICharacterData) => (
    <Stack
      horizontal
      tokens={{ childrenGap: 10 }}
      styles={{
        root: { padding: 0, maxHeight: "23px" },
      }}
    >
      {character.classes.map((cls) => {
        return (
          <Stack horizontal horizontalAlign="center" verticalAlign="center">
            <ClassIcon
              className={cls.class.name}
              styles={{
                root: {
                  borderRadius: "50%",
                  marginRight: DefaultSpacing.s2,
                  maxWidth: "20px",
                },
              }}
            />
            {character.classes.length > 1
              ? `${cls.class.name} (${cls.level})`
              : cls.class.name}
          </Stack>
        );
      })}
    </Stack>
  );

  const onRenderLevel = (character: ICharacterData) => {
    let levelToRender: Number;

    if (sessionData.isLoading) {
      levelToRender = character.currentLevel;
    } else {
      const sessionsAttended = sessionData.data.filter((session) =>
        session.attendees.includes(character.id)
      );

      const sessionRun = sessionData.data.filter(
        (session) =>
          session.dungeonMaster === character.playerDndBeyondName &&
          DataHelper.isSessionInPast(session)
      );

      const adjustedSessions = Math.floor(
        sessionsAttended.length + sessionRun.length / 2
      );

      const levelUp = LevelUpTable.filter(
        (level) => level.minSessions <= adjustedSessions
      );

      const calculatedLevel = levelUp[levelUp.length - 1].level;

      levelToRender = calculatedLevel;
    }

    return (
      <span
        style={{
          display: "block",
          textAlign: "left",
          paddingLeft: "1em",
        }}
      >
        {levelToRender}
      </span>
    );
  };

  const columns: IColumn[] = [
    {
      key: "avatar",
      name: "",
      fieldName: "avatarUrl",
      minWidth: 25,
      maxWidth: 25,
      onRender: onRenderAvatar,
    },
    {
      key: "level",
      name: "Level",
      fieldName: "currentLevel",
      minWidth: 33,
      maxWidth: 50,
      onRender: onRenderLevel,
    },
    {
      key: "name",
      name: "Name",
      fieldName: "name",
      minWidth: 200,
      isResizable: true,
      onRender: onRenderName,
    },
    {
      key: "race",
      name: "Race",
      fieldName: "race",
      minWidth: 150,
      isResizable: true,
      onRender: onRenderRace,
    },
    {
      key: "class",
      name: "Class",
      fieldName: "classes",
      minWidth: 175,
      isResizable: true,
      onRender: onRenderClasses,
    },
  ];

  const onClickCreateCharacter = () => {
    dispatch({
      type: "SetShowCharacterCreationDialog",
      showCharacterCreationDialog: true,
    });
  };

  return (
    <Stack
      className="characters-container"
      styles={{ root: { overflowY: "auto" } }}
    >
      <Stack
        horizontal
        className="character-table-header"
        styles={{
          root: {
            width: "100%",
            justifyContent: "space-between",
            alignItems: "flex-end",
            paddingTop: "1em",
            paddingBottom: "1em",
          },
        }}
      >
        <Text variant="superLarge">Characters</Text>
        <Toggle
          label="Compact Table"
          inlineLabel
          onText="Compact"
          offText="Normal"
          onChange={() => setCompactMode(!compactMode)}
        />
        <PrimaryButton
          text="New character"
          onClick={onClickCreateCharacter}
          disabled={!isDevMode}
        />
      </Stack>
      <Stack
        className="character-table-container"
        grow={1}
        styles={{
          root: {
            overflowY: "scroll",
            overflowX: "auto",
            flexGrow: 1,
          },
        }}
      >
        <ShimmeredDetailsList
          items={characterData.isLoading ? [] : characterData.data}
          columns={columns}
          enableShimmer={characterData.isLoading}
          selectionMode={SelectionMode.none}
          compact={compactMode}
          groups={
            characterData.isLoading
              ? undefined
              : [
                  {
                    startIndex: 0,
                    count: activeCharacters.length,
                    key: "active",
                    name: "Active Characters",
                  },
                  {
                    startIndex: activeCharacters.length,
                    count: retiredCharacters.length,
                    key: "retired",
                    name: "Retired Characters",
                  },
                ]
          }
        />
      </Stack>
    </Stack>
  );
};

export default CharacterTable;
