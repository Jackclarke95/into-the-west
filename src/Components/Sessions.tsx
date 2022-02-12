import React from "react";
import ISession from "../Interfaces/ISession";
import {
  FontSizes,
  Text,
  Stack,
  Facepile,
  PersonaSize,
  IFacepilePersona,
} from "@fluentui/react/";
import { useSelector } from "react-redux";

export const Sessions: React.FC<{
  characterImages: { characterId: number; imageUrl: string }[];
}> = ({ characterImages }) => {
  const characters = useSelector((state) => state.characters);
  const sessions = useSelector((state) => state.sessions);

  const getPersonas = (session: ISession): IFacepilePersona[] => {
    const foo = characters
      .filter((character) =>
        session.characterIds
          ? session.characterIds.includes(character.id)
          : false
      )
      .map((character) => {
        const persona: IFacepilePersona = {
          imageUrl: characterImages.find(
            (charImg) => charImg.characterId === character.id
          )?.imageUrl,
          personaName: character.name,
        };

        return persona;
      });

    return foo;
  };

  return (
    <Stack
      styles={{
        root: { width: "45%", overflowY: "auto" },
      }}
      tokens={{ childrenGap: 10 }}
    >
      <Text style={{ fontSize: FontSizes.superLarge }}>Sessions</Text>
      {sessions.map((session) => (
        <Stack
          horizontal
          styles={{ root: { justifyContent: "space-between" } }}
        >
          <Text>{session.name}</Text>
          <Facepile
            personas={getPersonas(session)}
            personaSize={PersonaSize.size32}
            maxDisplayablePersonas={10}
          ></Facepile>
        </Stack>
      ))}
    </Stack>
  );
};
