import React from "react";
import {
  CommandBar,
  ICommandBarItemProps,
} from "@fluentui/react/lib/CommandBar";

export const Commands: React.FC<{
  createCharacter: () => void;
  createSession: () => void;
  toggleCharacterCreationPanel: (shouldShow) => void;
  useDarkTheme: boolean;
  toggleTheme: (useDarkTheme: boolean) => void;
  setThemeOverride: (useDarkTheme: boolean) => void;
}> = ({
  createCharacter,
  createSession,
  toggleCharacterCreationPanel,
  useDarkTheme,
  toggleTheme,
  setThemeOverride,
}) => {
  const commandBarItems: ICommandBarItemProps[] = [
    {
      key: "newItem",
      text: "Clone Character",
      cacheKey: "myCacheKey", // changing this key will invalidate this item's cache
      iconProps: { iconName: "PeopleAdd" },
      onClick: (
        ev?:
          | React.MouseEvent<HTMLElement, MouseEvent>
          | React.KeyboardEvent<HTMLElement>
          | undefined
      ) => {
        createCharacter();
      },
    },
    {
      key: "newItem",
      text: "Clone Session",
      cacheKey: "myCacheKey", // changing this key will invalidate this item's cache
      iconProps: { iconName: "AddToShoppingList" },
      onClick: (
        ev?:
          | React.MouseEvent<HTMLElement, MouseEvent>
          | React.KeyboardEvent<HTMLElement>
          | undefined
      ) => {
        createSession();
      },
    },
    {
      key: "newItem",
      text: "New Character",
      cacheKey: "myCacheKey", // changing this key will invalidate this item's cache
      iconProps: { iconName: "AddFriend" },
      onClick: (
        ev?:
          | React.MouseEvent<HTMLElement, MouseEvent>
          | React.KeyboardEvent<HTMLElement>
          | undefined
      ) => {
        toggleCharacterCreationPanel(true);
      },
    },
    {
      key: "newItem",
      text: "Toggle Dark Mode",
      cacheKey: "myCacheKey", // changing this key will invalidate this item's cache
      iconProps: { iconName: useDarkTheme ? "Light" : "Light" },
      onClick: (
        ev?:
          | React.MouseEvent<HTMLElement, MouseEvent>
          | React.KeyboardEvent<HTMLElement>
          | undefined
      ) => {
        toggleTheme(!useDarkTheme);
        setThemeOverride(true);
      },
    },
  ];

  return <CommandBar items={commandBarItems}></CommandBar>;
};
