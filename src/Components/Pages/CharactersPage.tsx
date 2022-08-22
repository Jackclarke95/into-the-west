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
      <Text variant="xxLargePlus" styles={{ root: { marginLeft: 20 } }}>
        Characters
      </Text>
      <CharacterTable />
    </Stack>
  );
};

export default CharactersPage;
