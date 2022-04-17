import {
  DefaultButton,
  FontSizes,
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
} from "@fluentui/react";
import { useDispatch, useSelector } from "react-redux";
import CharacterPersona from "../CharacterPersona";

const ActiveCharacter = () => {
  const dispatch = useDispatch();

  const activeCharacter = useSelector((state) => state.activeCharacter);

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

  const onClickRetireCharacterButton = () => {
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
            <>
              <DefaultButton
                text="Edit"
                disabled={activeCharacter.isLoading || !activeCharacter.data}
              />
              <DefaultButton
                text="Retire"
                disabled={activeCharacter.isLoading || !activeCharacter.data}
                onClick={onClickRetireCharacterButton}
              />
            </>
          ) : (
            <DefaultButton
              text="New Character"
              disabled={
                activeCharacter.isLoading || activeCharacter.data !== undefined
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
