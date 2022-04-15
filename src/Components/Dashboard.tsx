import { useSelector } from "react-redux";
import { Stack, Text } from "@fluentui/react";
import ICharacterData from "../Interfaces/ICharacterData";

const Dashboard = () => {
  const characters = useSelector((state) => state.characters);
  const sessions = useSelector((state) => state.sessions);
  const currentUser = useSelector((state) => state.currentUser);

  let playerCharacters = [] as ICharacterData[];

  if (!characters.isLoading) {
    playerCharacters = characters.data.filter(
      (character) => character.playerDndBeyondName === currentUser.dndBeyondName
    );
  }

  console.log(playerCharacters);

  return (
    <Stack>
      <Text>Dashboard</Text>
      {playerCharacters.map((character) => {
        console.log(character);
        return <Text>{character.name}</Text>;
      })}
    </Stack>
  );
};

export default Dashboard;
