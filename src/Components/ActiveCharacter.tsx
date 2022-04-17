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
import CharacterPersona from "./CharacterPersona";

const ActiveCharacter = () => {
  const dispatch = useDispatch();

  const activeCharacter = useSelector((state) => state.activeCharacter);

  const dataToRender = () => {
    if (activeCharacter.isLoading) {
      return <Spinner size={SpinnerSize.large} label="Character Loading" />;
    } else if (!activeCharacter.data) {
      return (
        <MessageBar messageBarType={MessageBarType.warning} isMultiline>
          You do not have an active character. Create a new character using the
          button below.
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

  return (
    <Stack>
      <Stack horizontal styles={{ root: { justifyContent: "space-between" } }}>
        <Text
          styles={{
            root: { fontSize: FontSizes.xLarge, textAlign: "start" },
          }}
        >
          Active Character
        </Text>
        <Stack horizontal tokens={{ childrenGap: 10 }}>
          <DefaultButton
            text="Edit"
            disabled={activeCharacter.isLoading || !activeCharacter.data}
          />
          <DefaultButton
            text="Retire"
            disabled={activeCharacter.isLoading || !activeCharacter.data}
            onClick={onClickRetireCharacterButton}
          />
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
