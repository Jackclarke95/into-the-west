import {
  DefaultSpacing,
  IColumn,
  IGroup,
  Image,
  ImageFit,
  Link,
  SelectionMode,
  ShimmeredDetailsList,
  Stack,
} from "@fluentui/react";
import { useSelector } from "react-redux";
import { ClassIcon } from "../ClassIcon";
import DefaultAvatar from "../../Images/DefaultAvatar.jpeg";
import { Character } from "../../Types/LocalStructures";
import { useEffect, useState } from "react";
import XpBar from "../XpBar";

const CharacterTable = () => {
  const characters = useSelector((state) => state.characters);

  const [sortedCharacters, setSortedCharacters] = useState<Character[]>([]);
  const [activeCharacters, setActiveCharacters] = useState<Character[]>([]);
  const [inactiveCharacters, setInactiveCharacters] = useState<Character[]>([]);
  const [sortedColumn, setSortedColumn] = useState<{
    column: string;
    descending: boolean;
  }>({ column: "name", descending: false });

  useEffect(() => {
    if (characters.isLoading) {
      setSortedCharacters([]);

      return;
    }

    var sortedCharacters = [...characters.data].sort((a, b) =>
      a.fullName.localeCompare(b.fullName)
    );

    setSortedCharacters(sortedCharacters);
    setSortedColumn({ column: "name", descending: false });
  }, [characters]);

  useEffect(() => {
    const activeCharacters = sortedCharacters.filter(
      (character) => !character.retirement.isRetired
    );
    const inactiveCharacters = sortedCharacters.filter(
      (character) => character.retirement.isRetired
    );

    setActiveCharacters(activeCharacters);
    setInactiveCharacters(inactiveCharacters);
  }, [sortedCharacters]);

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

  const onRenderLevel = (character: Character) =>
    character.retirement.isRetired
      ? character.retirement.level
      : character.currentLevel;

  const onRenderName = (character: Character) =>
    !character.retirement.isRetired ? (
      character.sheetUrl ? (
        <Link href={character.sheetUrl} target="_blank">
          {character.fullName}
        </Link>
      ) : (
        character.fullName
      )
    ) : (
      `${character.fullName} (Retired)`
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
          {[...character.classes]
            .sort((a, b) => b.level - a.level)
            .map((cls) => {
              return (
                <Stack
                  horizontal
                  horizontalAlign="center"
                  verticalAlign="center"
                >
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

  const onRenderXpBar = (character: Character) => (
    <XpBar character={character} />
  );

  const onColumnClick = (
    _: React.MouseEvent<HTMLElement, MouseEvent>,
    column: IColumn
  ) => {
    var newlySortedCharacters = sortedCharacters;

    switch (column.key) {
      case "level": {
        newlySortedCharacters = sortedCharacters.sort(
          (a, b) => a.currentLevel! - b.currentLevel!
        );

        break;
      }

      case "name": {
        newlySortedCharacters = sortedCharacters.sort((a, b) =>
          a.fullName.localeCompare(b.fullName)
        );

        break;
      }

      case "race": {
        newlySortedCharacters = sortedCharacters.sort((a, b) =>
          `${a.race.subrace ?? a.race.race}`.localeCompare(
            `${b.race.subrace ?? b.race.race}`
          )
        );

        break;
      }

      case "class": {
        newlySortedCharacters = sortedCharacters.sort((a, b) =>
          a.classes[0].class.localeCompare(b.classes[0].class)
        );

        break;
      }

      default:
        return;
    }

    if (column.isSortedDescending) {
      newlySortedCharacters = sortedCharacters;
    } else {
      newlySortedCharacters = sortedCharacters.reverse();
    }

    const activeCharacters = newlySortedCharacters.filter(
      (character) => !character.retirement.isRetired
    );
    const inactiveCharacters = newlySortedCharacters.filter(
      (character) => character.retirement.isRetired
    );

    setActiveCharacters(activeCharacters);
    setInactiveCharacters(inactiveCharacters);

    setSortedColumn({
      column: column.key,
      descending: !column.isSortedDescending,
    });
  };

  const columns: IColumn[] = [
    {
      key: "avatar",
      name: "",
      minWidth: 20,
      maxWidth: 20,
      onRender: onRenderAvatar,
    },
    {
      key: "level",
      name: "Level",
      minWidth: 50,
      isSorted: sortedColumn.column === "level",
      isSortedDescending:
        sortedColumn.column === "level" && sortedColumn.descending,
      onRender: onRenderLevel,
      onColumnClick: onColumnClick,
    },
    {
      key: "name",
      name: "Name",
      minWidth: 150,
      isSorted: sortedColumn.column === "name",
      isSortedDescending:
        sortedColumn.column === "name" && sortedColumn.descending,
      onRender: onRenderName,
      onColumnClick: onColumnClick,
    },
    {
      key: "race",
      name: "Race",
      minWidth: 100,
      isSorted: sortedColumn.column === "race",
      isSortedDescending:
        sortedColumn.column === "race" && sortedColumn.descending,
      onRender: onRenderRace,
      onColumnClick: onColumnClick,
    },
    {
      key: "class",
      name: "Class",
      minWidth: 200,
      isSorted: sortedColumn.column === "class",
      isSortedDescending:
        sortedColumn.column === "class" && sortedColumn.descending,
      onRender: onRenderClass,
      onColumnClick: onColumnClick,
    },
    {
      key: "xp",
      name: "XP",
      minWidth: 200,
      onRender: onRenderXpBar,
    },
  ];

  const groups: IGroup[] = [
    {
      key: "active",
      name: "Active Characters",
      startIndex: 0,
      count: activeCharacters.length,
    },
    {
      key: "inactive",
      name: "Inactive Characters",
      startIndex: activeCharacters.length,
      count: inactiveCharacters.length,
      isCollapsed: true,
    },
  ];

  return (
    <ShimmeredDetailsList
      styles={{ root: { overFlowY: "auto" } }}
      columns={columns}
      enableShimmer={activeCharacters.length === 0}
      items={[...activeCharacters, ...inactiveCharacters]}
      groups={groups}
      selectionMode={SelectionMode.none}
      columnReorderOptions={{
        frozenColumnCountFromStart: 1,
        frozenColumnCountFromEnd: 1,
      }}
    />
  );
};

export default CharacterTable;
