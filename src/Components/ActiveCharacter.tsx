import {
  MessageBar,
  MessageBarType,
  Spinner,
  SpinnerSize,
  Stack,
} from "@fluentui/react";
import { useSelector } from "react-redux";
import CharacterPersona from "./CharacterPersona";

const ActiveCharacter = () => {
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

  return (
    <Stack verticalAlign="center" styles={{ root: { height: 72, width: 350 } }}>
      {dataToRender()}
    </Stack>
  );
};

export default ActiveCharacter;
