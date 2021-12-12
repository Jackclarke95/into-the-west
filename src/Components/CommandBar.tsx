import React from "react";
import {
  CommandBar,
  ICommandBarItemProps,
} from "@fluentui/react/lib/CommandBar";
import { IButtonProps } from "@fluentui/react/lib/Button";

export const Commands: React.FC<{
  createCharacter: () => void;
  createSession: () => void;
  toggleCharacterCreationPanel: (shouldShow) => void;
}> = ({ createCharacter, createSession, toggleCharacterCreationPanel }) => {
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
        console.log("click");
        toggleCharacterCreationPanel(true);
      },
    },
  ];

  return <CommandBar items={commandBarItems}></CommandBar>;
};
