import React from "react";
import {
  DefaultSpacing,
  IColumn,
  Image,
  ImageFit,
  Link,
  PrimaryButton,
  ProgressIndicator,
  SelectionMode,
  ShimmeredDetailsList,
  Stack,
  Text,
  Toggle,
  TooltipHost,
} from "@fluentui/react";
import { ClassIcon } from "./ClassIcon";
import DefaultAvatar from "../Images/DefaultAvatar.jpeg";
import { useDispatch, useSelector } from "react-redux";
import ICharacterData from "../Interfaces/ICharacterData";
import { Data } from "../Data/Data";
import { XpTable } from "../Data/XpTable";

export const CharacterTable = () => {
  const characterData = useSelector((state) => state.characters);
  const experienceData = useSelector((state) => state.experience);
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
      {character.classes.map((cls) => (
        <Stack horizontal horizontalAlign="center" verticalAlign="center">
          <ClassIcon
            className={cls.name}
            styles={{
              root: {
                borderRadius: "50%",
                marginRight: DefaultSpacing.s2,
                maxWidth: "20px",
              },
            }}
          />
          {character.classes.length > 1
            ? `${cls.name} (${cls.level})`
            : cls.name}
        </Stack>
      ))}
    </Stack>
  );

  const onRenderLevel = (character: ICharacterData) => (
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

  const onRenderXp = (character: ICharacterData) => {
    if (experienceData.isLoading) {
      return <ProgressIndicator />;
    }

    const characterXp = experienceData.data
      .filter((experience) => experience.characterId === character.id)
      .reduce((acc, curr) => acc + curr.xp, 0);

    return (
      <TooltipHost
        content={`${characterXp} / ${
          XpTable[character.currentLevel + 1] - XpTable[character.currentLevel]
        } XP`}
      >
        <ProgressIndicator
          percentComplete={
            characterXp /
            (XpTable[character.currentLevel + 1] -
              XpTable[character.currentLevel])
          }
        />
      </TooltipHost>
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
    {
      key: "level",
      name: "Level",
      fieldName: "currentLevel",
      minWidth: 33,
      maxWidth: 50,
      onRender: onRenderLevel,
    },
    {
      key: "xp",
      name: "XP",
      fieldName: "xp",
      minWidth: 100,
      maxWidth: 100,
      onRender: onRenderXp,
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
        <PrimaryButton text="New character" onClick={onClickCreateCharacter} />
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
