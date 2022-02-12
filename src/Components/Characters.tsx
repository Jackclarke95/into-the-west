import React from "react";
import { FontSizes, Text, Stack, PersonaSize } from "@fluentui/react/";
import { useSelector } from "react-redux";
import { CharacterPersona } from "./CharacterPersona";

export const Characters: React.FC<{}> = () => {
  const characters = useSelector((state) => state.characters);

  return (
    <Stack
      styles={{ root: { width: "45%", overflowY: "auto" } }}
      tokens={{ childrenGap: 10 }}
    >
      <Text style={{ fontSize: FontSizes.superLarge }}>Characters</Text>
      {characters.map((character) => (
        <CharacterPersona
          character={character}
          characterImage={undefined} // TODO: get image
          size={PersonaSize.size100}
        />
      ))}
    </Stack>
  );
};
