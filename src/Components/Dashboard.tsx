import { useDispatch, useSelector } from "react-redux";
import {
  FontSizes,
  Persona,
  PersonaSize,
  PrimaryButton,
  Shimmer,
  ShimmerCircle,
  Spinner,
  SpinnerSize,
  Stack,
  Text,
} from "@fluentui/react";
import ICharacterData from "../Interfaces/ICharacterData";
import CharacterPersona from "./CharacterPersona";
import CharacterTable from "./CharacterTable";
import SessionTable from "./SessionTable";

const Dashboard = () => {
  const dispatch = useDispatch();

  const isDevMode = useSelector((state) => state.isDevMode);
  const characters = useSelector((state) => state.characters);
  const sessions = useSelector((state) => state.sessions);
  const currentUser = useSelector((state) => state.currentUser);

  let activeCharacters = [] as ICharacterData[];
  let inactiveCharacters = [] as ICharacterData[];

  if (!characters.isLoading) {
    activeCharacters = characters.data.filter(
      (character) =>
        character.playerDndBeyondName === currentUser.dndBeyondName &&
        !character.retirement
    );

    inactiveCharacters = characters.data.filter(
      (character) =>
        character.retirement &&
        character.playerDndBeyondName === currentUser.dndBeyondName
    );
  }

  const onClickCreateCharacter = () => {
    console.log("creating character");

    dispatch({
      type: "SetShowCharacterCreationDialog",
      showCharacterCreationDialog: true,
    });
  };

  const onClickCreateSession = () => {
    dispatch({
      type: "SetShowSessionCreationDialog",
      showSessionCreationDialog: true,
    });
  };

  return (
    <Stack
      className="body-container"
      verticalFill
      horizontal
      horizontalAlign="center"
      tokens={{ childrenGap: 20 }}
      styles={{ root: { overflowY: "auto", height: "100%", width: "100%" } }}
    >
      <Stack tokens={{ childrenGap: 10 }}>
        <Text variant={"xxLarge"}>My Profile</Text>
        {characters.isLoading ? (
          <Stack
            styles={{ root: { height: 72, width: 350 } }}
            verticalAlign="center"
          >
            <Spinner size={SpinnerSize.large} label="Character Loading" />
          </Stack>
        ) : (
          <CharacterPersona character={activeCharacters[0]} />
        )}
        <PrimaryButton
          text="New character"
          onClick={onClickCreateCharacter}
          disabled={!isDevMode}
        />
        <PrimaryButton
          text="New session"
          onClick={onClickCreateSession}
          disabled={!isDevMode}
        />
      </Stack>
      <Stack
        className="body-container"
        verticalFill
        tokens={{ childrenGap: 10 }}
        styles={{ root: { overflowY: "auto", height: "100%" } }}
      >
        <Text variant="superLarge">Characters</Text>
        <CharacterTable />
        <Text variant="superLarge">Sessions</Text>
        <SessionTable />
      </Stack>
    </Stack>
  );
};

export default Dashboard;
