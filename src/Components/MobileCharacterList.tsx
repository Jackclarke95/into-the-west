import { Stack } from "@fluentui/react";
import { useSelector } from "react-redux";
import CharacterCard from "./Cards/CharacterCard";

const MobileCharacterList = () => {
  const characters = useSelector((state) => state.characters);

  return (
    <Stack
      tokens={{ childrenGap: 20 }}
      styles={{ root: { width: "100%", padding: "1em" } }}
    >
      {!characters.isLoading &&
        characters.data.map((character) => (
          <>
            <CharacterCard character={character} />
          </>
        ))}
    </Stack>
  );
};

export default MobileCharacterList;
