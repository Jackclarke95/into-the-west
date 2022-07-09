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
import { ClassIcon } from "../ClassIcon";
import DefaultAvatar from "../../Images/DefaultAvatar.jpeg";
import LevelUpData from "../../Data/LevelUp";
import { Character } from "../../Types/LocalStructures";

const NewCharacterTable = () => {
  const characters = useSelector((state) => state.parsedCharacters);

  const onRenderAvatar = (character: Character) => (
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

  const onRenderName = (character: Character) =>
    character.sheetUrl ? (
      <Link href={character.sheetUrl}>{character.fullName}</Link>
    ) : (
      character.fullName
    );

  const onRenderRace = (character: Character) => {
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

  const onRenderClass = (character: Character) => {
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

  const onRenderXpBar = (character: Character) => {
    if (!character.player) {
      return (
        <TooltipHost content="Could not find player for this character">
          <ProgressIndicator />
        </TooltipHost>
      );
    }

    console.log(character);

    const xpForCurrentLevel =
      LevelUpData[Math.floor(character.player.xp / 120) - 1].xpRequired;

    const xpToNextLevel =
      LevelUpData[Math.floor(character.player.xp / 120)].xpRequired;

    const current = character.player.xp - xpForCurrentLevel;
    const high = xpToNextLevel - xpForCurrentLevel;

    return (
      <TooltipHost
        content={`${character.player.xp - xpForCurrentLevel} / ${
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
