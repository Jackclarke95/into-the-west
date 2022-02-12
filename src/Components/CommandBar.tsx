import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  CommandBar,
  ICommandBarItemProps,
} from "@fluentui/react/lib/CommandBar";

export const Commands: React.FC<{
  setThemeOverride: (useDarkTheme: boolean) => void;
}> = ({ setThemeOverride }) => {
  const dispatch = useDispatch();

  const darkMode = useSelector((state) => state.darkMode);

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
        // createCharacter();
      },
    },
    {
      key: "newItem",
      text: "New Session",
      cacheKey: "myCacheKey", // changing this key will invalidate this item's cache
      iconProps: { iconName: "AddToShoppingList" },
      onClick: (
        ev?:
          | React.MouseEvent<HTMLElement, MouseEvent>
          | React.KeyboardEvent<HTMLElement>
          | undefined
      ) => {
        dispatch({
          type: "SetShowNewSessionPanel",
          showNewSessionPanel: true,
        });
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
        dispatch({
          type: "SetShowNewCharacterPanel",
          showNewCharacterPanel: true,
        });
      },
    },
    {
      key: "newItem",
      text: "Toggle Dark Mode",
      cacheKey: "myCacheKey", // changing this key will invalidate this item's cache
      iconProps: { iconName: darkMode ? "Sunny" : "ClearNight" },
      onClick: (
        ev?:
          | React.MouseEvent<HTMLElement, MouseEvent>
          | React.KeyboardEvent<HTMLElement>
          | undefined
      ) => {
        dispatch({ type: "SetDarkMode", darkMode: !darkMode });
        setThemeOverride(true);
      },
    },
  ];

  return <CommandBar items={commandBarItems}></CommandBar>;
};
