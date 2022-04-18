import { useSelector } from "react-redux";
import {
  DefaultSpacing,
  FontSizes,
  IColumn,
  Image,
  ImageFit,
  Link,
  SelectionMode,
  ShimmeredDetailsList,
  Stack,
  Text,
} from "@fluentui/react";
import { ClassIcon } from "../ClassIcon";
import DefaultAvatar from "../../Images/DefaultAvatar.jpeg";
import ICharacterData from "../../Interfaces/ICharacterData";
import LevelUpTable from "../../Data/LevelUp";
import DataHelper from "../../Helpers/DataHelper";

const CharacterTable = () => {
  const characterData = useSelector((state) => state.characters);
  const sessionData = useSelector((state) => state.sessions);

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

  const onRenderName = (character: ICharacterData) => {
    return (
      <Stack horizontal tokens={{ childrenGap: 3 }}>
        {character.sheetUrl ? (
          <Stack>
            <Link target="_blank" href={character.sheetUrl}>
              {character.name}
            </Link>
          </Stack>
        ) : (
          <span>{character.name}</span>
        )}
        {character.retirement && <i>(Retired)</i>}
      </Stack>
    );
  };

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

      const sessionsRun = sessionData.data.filter((session) => {
        const dmMatch = session.dungeonMaster === character.playerDndBeyondName;
        const isInpast = DataHelper.isDateInPast(new Date(session.date));

        return dmMatch && isInpast;
      });

      const adjustedSessions = Math.floor(
        sessionsAttended.length + sessionsRun.length / 2
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

  return (
    <Stack styles={{ root: { overflowY: "auto" } }}>
      <Text
        styles={{
          root: { fontSize: FontSizes.xLargePlus, textAlign: "start" },
        }}
      >
        Characters
      </Text>
      <ShimmeredDetailsList
        items={characterData.isLoading ? [] : characterData.data}
        columns={columns}
        enableShimmer={characterData.isLoading}
        selectionMode={SelectionMode.none}
        compact
      />
    </Stack>
  );
};

export default CharacterTable;
