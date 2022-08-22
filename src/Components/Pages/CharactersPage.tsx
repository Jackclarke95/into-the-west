import { Stack, Text } from "@fluentui/react";
import CharacterTable from "../Tables/CharacterTable";

const CharactersPage = () => {
  return (
    <Stack
      verticalFill
      styles={{
        root: {
          overflowY: "scroll",
        },
      }}
    >
      <Text variant="xxLarge">Characters</Text>
      <CharacterTable />
    </Stack>
  );
};

export default CharactersPage;
