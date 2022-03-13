import React from "react";
import {
  DefaultSpacing,
  DetailsListLayoutMode,
  IColumn,
  Image,
  ImageFit,
  SelectionMode,
  ShimmeredDetailsList,
  Stack,
  Toggle,
} from "@fluentui/react";
import { Data } from "../Data/Data";
import { ClassIcon } from "./ClassIcon";
import DefaultAvatar from "../Images/DefaultAvatar.jpeg";
import { useSelector } from "react-redux";

interface CharacterData {
  id: number;
  avatarUrl: string;
  playerDndBeyondName: string;
  name: string;
  nickname: string | undefined;
  race: string;
  subrace: string | undefined;
  classes: {
    className: string;
    level: number;
    archetype: string | undefined;
  }[];
  currentLevel: number;
  sessionsAttended: number;
  startingLevel: number;
  retirement: {
    reason: string;
    date: string;
  };
}

export const CharacterTable = () => {
  const [compactMode, setCompactMode] = React.useState(false);

  const currentUser = useSelector((state) => state.currentUser);

  const characterData = Object.keys(Data.characters)
    .map((key) => {
      const character = Data.characters[key] as CharacterData;

      return character;
    })
    .sort((characterA, characterB) =>
      characterA.name.localeCompare(characterB.name)
    )
    .sort((characterA, characterB) => {
      if (characterA.retirement && !characterB.retirement) {
        return 1;
      } else if (!characterA.retirement && characterB.retirement) {
        return -1;
      } else return 0;
    });

  const activeCharacters = characterData.filter(
    (character) => !character.retirement
  );

  const retiredCharacters = characterData.filter(
    (character) => character.retirement
  );

  const onRenderAvatar = (character: CharacterData) => {
    return (
      <Image
        src={
          character.avatarUrl.length > 0 ? character.avatarUrl : DefaultAvatar
        }
        imageFit={ImageFit.contain}
        styles={{
          root: {
            borderRadius: "50%",
            maxHeight: "20px",
            maxWidth: "20px",
            filter:
              character.avatarUrl.length == 0
                ? `hue-rotate(${
                    Math.random() * 360
                  }deg) brightness(1.5) invert(100%) ${
                    character.retirement
                      ? `grayscale(100%) brightness(0.5)`
                      : ""
                  }`
                : undefined,
          },
        }}
      />
    );
  };

  const onRenderRace = (character: CharacterData) =>
    character.subrace
      ? `${character.subrace} ${character.race}`
      : character.race;

  const onRenderClasses = (character: CharacterData) => (
    <Stack
      horizontal
      tokens={{ childrenGap: 10 }}
      styles={{
        root: { padding: 0, maxHeight: "23px" },
      }}
    >
      {character.classes.map((cls) => (
        <Stack horizontal horizontalAlign="center" verticalAlign="center">
          <ClassIcon
            className={cls.className}
            styles={{
              root: {
                borderRadius: "50%",
                marginRight: DefaultSpacing.s2,
                maxWidth: "20px",
              },
            }}
          />
          {character.classes.length > 1
            ? `${cls.className} (${cls.level})`
            : cls.className}
        </Stack>
      ))}
    </Stack>
  );

  const onRenderLevel = (character: CharacterData) => (
    <span
      style={{
        display: "block",
        textAlign: "left",
        paddingLeft: "1em",
      }}
    >
      {character.currentLevel}
    </span>
  );

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
      key: "name",
      name: "Name",
      fieldName: "name",
      minWidth: 200,
      isResizable: true,
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
    {
      key: "level",
      name: "Level",
      fieldName: "currentLevel",
      minWidth: 33,
      maxWidth: 50,
      onRender: onRenderLevel,
    },
  ];

  return (
    <>
      <Stack>
        <Toggle
          label="Toggle Compact Table"
          inlineLabel
          onText="Compact"
          offText="Normal"
          onChange={() => setCompactMode(!compactMode)}
        />
      </Stack>
      <Stack
        className="character-table-container"
        grow={1}
        styles={{
          root: {
            overflowY: "scroll",
          },
        }}
      >
        <ShimmeredDetailsList
          layoutMode={DetailsListLayoutMode.fixedColumns}
          items={characterData}
          columns={columns}
          compact={compactMode}
          selectionMode={SelectionMode.none}
          groups={[
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
              isCollapsed: true,
            },
          ]}
        />
      </Stack>
    </>
  );
};
