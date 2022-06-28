import {
  DefaultSpacing,
  IColumn,
  Image,
  ImageFit,
  Link,
  ProgressIndicator,
  SelectionMode,
  ShimmeredDetailsList,
  Stack,
  TooltipHost,
} from "@fluentui/react";
import { useSelector } from "react-redux";
import IParsedCharacter from "../../Interfaces/Parsed/IParsedCharacter";
import { ClassIcon } from "../ClassIcon";
import DefaultAvatar from "../../Images/DefaultAvatar.jpeg";
import LevelUpData from "../../Data/LevelUp";

const NewCharacterTable = () => {
  const characters = useSelector((state) => state.parsedCharacters);

  const onRenderAvatar = (character: IParsedCharacter) => (
    <Image
      src={character.avatarUrl ? character.avatarUrl : DefaultAvatar}
      imageFit={ImageFit.cover}
      styles={{
        root: {
          borderRadius: "50%",
          height: 16,
          width: 16,
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

  const onRenderName = (character: IParsedCharacter) =>
    character.sheetUrl ? (
      <Link href={character.sheetUrl}>{character.name}</Link>
    ) : (
      character.name
    );

  const onRenderRace = (character: IParsedCharacter) => {
    if (characters.isLoading) {
      return <span>Loading</span>;
    } else {
      if (character.race.subrace) {
        return (
          <span>{`${character.race.subrace} ${character.race.race}`}</span>
        );
      } else {
        return <span>{character.race.race}</span>;
      }
    }
  };

  const onRenderClass = (character: IParsedCharacter) => {
    if (characters.isLoading) {
      return <span>Loading</span>;
    } else {
      return (
        <Stack horizontal tokens={{ childrenGap: 10 }}>
          {character.classes.map((cls) => {
            return (
              <Stack horizontal horizontalAlign="center" verticalAlign="center">
                <ClassIcon
                  className={cls.class}
                  styles={{
                    root: {
                      borderRadius: "50%",
                      marginRight: DefaultSpacing.s2,
                      maxWidth: 16,
                    },
                  }}
                />
                {character.classes.length > 1
                  ? `${cls.class} (${cls.level})`
                  : cls.class}
              </Stack>
            );
          })}
        </Stack>
      );
    }
  };

  const onRenderXpBar = (character: IParsedCharacter) => {
    const xpForCurrentLevel =
      LevelUpData[Math.floor(character.user.xp / 120) - 1].xpRequired;

    const xpToNextLevel =
      LevelUpData[Math.floor(character.user.xp / 120)].xpRequired;

    const current = character.user.xp - xpForCurrentLevel;
    const high = xpToNextLevel - xpForCurrentLevel;

    return (
      <TooltipHost
        content={`${character.user.xp - xpForCurrentLevel} / ${
          xpToNextLevel - xpForCurrentLevel
        }`}
      >
        <ProgressIndicator percentComplete={current / high} />
      </TooltipHost>
    );
  };

  const columns: IColumn[] = [
    {
      key: "avatar",
      name: "",
      fieldName: "avatar",
      minWidth: 20,
      maxWidth: 20,
      onRender: onRenderAvatar,
    },
    {
      key: "level",
      name: "Level",
      fieldName: "currentLevel",
      minWidth: 40,
    },
    {
      key: "name",
      name: "Name",
      fieldName: "name",
      minWidth: 150,
      onRender: onRenderName,
    },
    {
      key: "race",
      name: "Race",
      minWidth: 100,
      onRender: onRenderRace,
    },
    {
      key: "class",
      name: "Class",
      minWidth: 200,
      onRender: onRenderClass,
    },
    { key: "xp", name: "XP", minWidth: 200, onRender: onRenderXpBar },
  ];

  return (
    <ShimmeredDetailsList
      styles={{ root: { overFlowY: "auto" } }}
      columns={columns}
      enableShimmer={characters.isLoading}
      items={characters.isLoading ? [] : characters.data}
      selectionMode={SelectionMode.none}
    />
  );
};

export default NewCharacterTable;
