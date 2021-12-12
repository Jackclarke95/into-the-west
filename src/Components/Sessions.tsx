import React, { useEffect } from "react";
import ISession from "../Interfaces/ISession";
import {
  FontSizes,
  Text,
  Stack,
  Facepile,
  PersonaSize,
  Persona,
  IFacepilePersona,
} from "@fluentui/react/";
import ICharacter from "../Interfaces/ICharacter";
import { firestore } from "../firebase.utils";

export const Sessions: React.FC<{
  characters: ICharacter[];
  sessions: ISession[];
  characterImages: { characterId: number; imageUrl: string }[];
}> = ({ characters, sessions, characterImages }) => {
  const GetImageUrl = (character) => {
    var imageUrl = "";

    useEffect(() => {
      firestore
        .ref(`Avatars/${character.id}.jpeg`)
        .getDownloadURL()
        .then((url) => {
          imageUrl = url;
        })
        .catch(
          () =>
            (imageUrl =
              "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/characters/default-avatar-builder.png")
        );

      if (character.name == "Eslyn Juhlenath") {
        debugger;
      }
    }, [character]);

    return imageUrl;
  };

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
