import { Spinner, SpinnerSize, Stack } from "@fluentui/react";
import { useSelector } from "react-redux";
import ICharacterData from "../Interfaces/ICharacterData";
import CharacterPersona from "./CharacterPersona";

const ActiveCharacter = () => {
  const characters = useSelector((state) => state.characters);
  const currentUser = useSelector((state) => state.currentUser);

  let activeCharacter: ICharacterData | undefined;

  if (!characters.isLoading) {
    activeCharacter = characters.data.find(
      (character) =>
        character.playerDndBeyondName === currentUser.dndBeyondName &&
        !character.retirement
    );
  }

  if (characters.isLoading || !activeCharacter) {
    return (
      <Stack
        styles={{ root: { height: 72, width: 350 } }}
        verticalAlign="center"
      >
        <Spinner size={SpinnerSize.large} label="Character Loading" />
      </Stack>
    );
  } else {
    return <CharacterPersona character={activeCharacter} />;
  }
};

export default ActiveCharacter;
