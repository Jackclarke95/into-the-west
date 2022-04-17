import { useDispatch, useSelector } from "react-redux";
import { FontSizes, Stack, Text } from "@fluentui/react";
import ICharacterData from "../Interfaces/ICharacterData";
import CharacterTable from "./CharacterTable";
import SessionTable from "./SessionTable";
import Profile from "./Profile";

const Dashboard = () => {
  const dispatch = useDispatch();

  const isDevMode = useSelector((state) => state.isDevMode);
  const characters = useSelector((state) => state.characters);
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

  return (
    <Stack
      className="body-container"
      verticalFill
      horizontal
      horizontalAlign="center"
      tokens={{ childrenGap: 20 }}
      styles={{ root: { overflowY: "auto", height: "100%", width: "100%" } }}
    >
      <Profile />
      <Stack
        className="body-container"
        verticalFill
        tokens={{ childrenGap: 10 }}
        styles={{ root: { overflowY: "auto", height: "100%" } }}
      >
        <Text
          styles={{
            root: { fontSize: FontSizes.superLarge, textAlign: "start" },
          }}
        >
          Characters
        </Text>
        <CharacterTable />
        <Text
          styles={{
            root: { fontSize: FontSizes.superLarge, textAlign: "start" },
          }}
        >
          Sessions
        </Text>
        <SessionTable />
      </Stack>
    </Stack>
  );
};

export default Dashboard;
