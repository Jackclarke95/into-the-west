import React from "react";
import {
  DefaultSpacing,
  DetailsListLayoutMode,
  IColumn,
  IDetailsHeaderProps,
  Image,
  ImageFit,
  IRenderFunction,
  ScrollablePane,
  ScrollbarVisibility,
  SelectionMode,
  ShimmeredDetailsList,
  Stack,
  Sticky,
  StickyPositionType,
  Toggle,
} from "@fluentui/react";
import { Data } from "../Data/Data";
import { ClassIcon } from "./ClassIcon";
import DefaultAvatar from "../Images/DefaultAvatar.jpeg";

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

  console.log("active", activeCharacters);
  console.log("retired", retiredCharacters);

  const columns: IColumn[] = [
    {
      key: "avatar",
      name: "",
      fieldName: "avatarUrl",
      minWidth: 25,
      maxWidth: 25,
      onRender: (character: CharacterData) => {
        return (
          <Image
            src={
              character.avatarUrl.length > 0
                ? character.avatarUrl
                : DefaultAvatar
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
      },
    },
    {
      key: "name",
      name: "Name",
      fieldName: "name",
      minWidth: 100,
      isResizable: true,
    },
    {
      key: "race",
      name: "Race",
      fieldName: "race",
      minWidth: 100,
      isResizable: true,
    },
    {
      key: "class",
      name: "Class",
      fieldName: "classes",
      minWidth: 200,
      isResizable: true,
      onRender: (character: CharacterData) => {
        return (
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
      },
    },
    {
      key: "level",
      name: "Level",
      fieldName: "currentLevel",
      minWidth: 50,
      isResizable: true,
      styles: { root: { textAlign: "center" } },
    },
  ];

  const onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (
    headerProps,
    defaultRender
  ) => {
    return (
      <Sticky
        stickyPosition={StickyPositionType.Header}
        stickyBackgroundColor="transparent"
      >
        {" "}
        <div>{defaultRender!(headerProps)}</div>
      </Sticky>
    );
  };

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
      <Stack className="character-table-container" grow={1}>
        {/* <ScrollablePane scrollbarVisibility={ScrollbarVisibility.auto}> */}
        <ShimmeredDetailsList
          layoutMode={DetailsListLayoutMode.fixedColumns}
          items={characterData}
          columns={columns}
          selectionMode={SelectionMode.none}
          compact={compactMode}
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
            },
          ]}
          // onRenderDetailsFooter={(props) => {
          //   return props?.columns;
          // }}
          onRenderDetailsHeader={onRenderDetailsHeader}
        />
        {/* </ScrollablePane> */}
      </Stack>
    </>
  );
};
