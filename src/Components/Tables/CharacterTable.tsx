import { useSelector } from "react-redux";
import {
  DefaultSpacing,
  DetailsRow,
  DirectionalHint,
  FontSizes,
  IColumn,
  IDetailsListProps,
  Image,
  ImageFit,
  ITooltipProps,
  Link,
  SelectionMode,
  Separator,
  ShimmeredDetailsList,
  Stack,
  TooltipHost,
} from "@fluentui/react";
import { ClassIcon } from "../ClassIcon";
import DefaultAvatar from "../../Images/DefaultAvatar.jpeg";
import ICharacter from "../../Interfaces/ICharacter";
import LevelUpTable from "../../Data/LevelUp";
import DataHelper from "../../Helpers/DataHelper";

const CharacterTable = () => {
  const characterData = useSelector((state) => state.characters);
  const sessionData = useSelector((state) => state.sessions);

  const onRenderAvatar = (character: ICharacter) => (
    <Image
      src={character.avatarUrl ? character.avatarUrl : DefaultAvatar}
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

  const onRenderName = (character: ICharacter) => {
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

  const onRenderRace = (character: ICharacter) =>
    character.race.subrace
      ? `${character.race.subrace} ${character.race}`
      : character.race;

  const onRenderClasses = (character: ICharacter) => (
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
        );
      })}
    </Stack>
  );

  const onRenderLevel = (character: ICharacter) => {
    let levelToRender: Number;

    if (sessionData.isLoading) {
      levelToRender = character.currentLevel;
    } else {
      const sessionsAttended = sessionData.data.filter((session) =>
        session.attendees.includes(character.key)
      );

      const sessionsRun = sessionData.data.filter((session) => {
        const dmMatch = session.dungeonMaster === character.playerDndBeyondName;
        const isInpast = !session.date || DataHelper.isDateInPast(session.date);

        return dmMatch && isInpast;
      });

      const adjustedSessions = Math.floor(
        sessionsAttended.length + sessionsRun.length / 2
      );

      const levelUp = LevelUpTable.filter(
        (level) => level.sessionsRequired <= adjustedSessions
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

  const onRenderRow: IDetailsListProps["onRenderRow"] = (props) => {
    if (props) {
      const character = props.item as ICharacter;

      const tooltipProps: ITooltipProps = {
        onRenderContent: () => {
          return (
            <Image
              src={character.avatarUrl ? character.avatarUrl : DefaultAvatar}
              imageFit={ImageFit.cover}
              styles={{
                root: {
                  borderRadius: "50%",
                  height: "250px",
                  width: "250px",
                  filter:
                    character.avatarUrl === ""
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
        },
      };

      return (
        <TooltipHost
          tooltipProps={tooltipProps}
          directionalHint={DirectionalHint.leftCenter}
        >
          <DetailsRow {...props} />
        </TooltipHost>
      );
    }
    return null;
  };

  return (
    <Stack
      styles={{
        root: {
          maxHeight: "50%",
        },
      }}
    >
      <Separator
        styles={{
          root: {
            fontSize: FontSizes.xLargePlus,
          },
        }}
      >
        Characters
      </Separator>
      <Stack styles={{ root: { overflowY: "auto" } }}>
        <ShimmeredDetailsList
          items={characterData.isLoading ? [] : characterData.data}
          columns={columns}
          onRenderRow={onRenderRow}
          enableShimmer={characterData.isLoading}
          selectionMode={SelectionMode.none}
          compact
        />
      </Stack>
    </Stack>
  );
};

export default CharacterTable;
