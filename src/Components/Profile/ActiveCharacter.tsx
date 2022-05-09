import {
  DefaultButton,
  FontSizes,
  IContextualMenuProps,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
} from "@fluentui/react";
import { useDispatch, useSelector } from "react-redux";
import CharacterPersona from "../Cards/CharacterCard";

const ActiveCharacter = () => {
  const dispatch = useDispatch();

  const activeCharacter = useSelector((state) => state.activeCharacter);
  const isDevMode = useSelector((state) => state.isDevMode);

  const dataToRender = () => {
    if (activeCharacter.isLoading) {
      return <Spinner size={SpinnerSize.large} label="Loading Character" />;
    } else if (!activeCharacter.data) {
      return (
        <MessageBar messageBarType={MessageBarType.warning} isMultiline>
          You do not have an character. Create a new character using the button
          above.
        </MessageBar>
      );
    } else {
      return <CharacterPersona character={activeCharacter.data} />;
    }
  };

  const onClickRetireCharacter = () => {
    dispatch({
      type: "SetShowCharacterRetirementDialog",
      showCharacterRetirementDialog: true,
    });
  };

  const onClickCreateCharacter = () => {
    console.log("creating character");

    dispatch({
      type: "SetShowCharacterCreationDialog",
      showCharacterCreationDialog: true,
    });
  };

  const menuProps: IContextualMenuProps = {
    items: [
      {
        key: "manageCharacter",
        text: "Manage character",
        iconProps: { iconName: "EditContact" },
      },
      {
        key: "retire",
        text: "Retire",
        iconProps: { iconName: "UserRemove" },
        onClick: onClickRetireCharacter,
      },
    ],
  };

  return (
    <Stack tokens={{ childrenGap: 10 }}>
      <Stack horizontal styles={{ root: { justifyContent: "space-between" } }}>
        <Text
          styles={{
            root: { fontSize: FontSizes.xLarge, textAlign: "start" },
          }}
        >
          Active Character
        </Text>
        <Stack horizontal tokens={{ childrenGap: 10 }}>
          {!activeCharacter.isLoading && activeCharacter.data ? (
            <DefaultButton
              text="Character"
              split
              menuProps={menuProps}
              disabled={
                !isDevMode || activeCharacter.isLoading || !activeCharacter.data
              }
            />
          ) : (
            <DefaultButton
              text="New Character"
              disabled={
                !isDevMode ||
                activeCharacter.isLoading ||
                activeCharacter.data !== undefined
              }
              onClick={onClickCreateCharacter}
            />
          )}
        </Stack>
      </Stack>
      <Stack
        verticalAlign="center"
        styles={{ root: { height: 72, width: 350 } }}
      >
        {dataToRender()}
      </Stack>
    </Stack>
  );
};

export default ActiveCharacter;
