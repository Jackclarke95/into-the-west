import React, { useEffect } from "react";
import { Persona, PersonaSize, ProgressIndicator } from "@fluentui/react/";
import ICharacter from "../Interfaces/ICharacter";
import { firestore } from "../firebase.utils";

export const CharacterPersona: React.FC<{
  character: ICharacter;
  characterImages: { characterId: number; imageUrl: string }[];
  setCharacterImages: (
    charImages: { characterId: number; imageUrl: string }[]
  ) => void;
  // imageUrl: string;
}> = ({ character, characterImages, setCharacterImages }) => {
  const [imageUrl, setImageUrl] = React.useState<string>("");

  useEffect(() => {
    const unsubscribe = () =>
      firestore
        .ref(`Avatars/${character.id}.jpeg`)
        .getDownloadURL()
        .then((url) => {
          setImageUrl(url);
          setCharacterImages([
            ...characterImages.filter(
              (charImg: { characterId: number; imageUrl: string }) =>
                charImg.characterId !== character.id
            ),
            {
              characterId: character.id,
              imageUrl: url,
            },
          ]);
        })
        .catch(() =>
          setImageUrl(
            "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/characters/default-avatar-builder.png"
          )
        );

    unsubscribe();
  }, [character, firestore]);

  const levelProgress = () => (
    <ProgressIndicator
      label={`Level Progress: ${character.sessionToLevelUp}/${
        character.maxSessionsToNextLevel
      } - ${(
        ((character.sessionToLevelUp / character.maxSessionsToNextLevel) % 1) *
        100
      ).toFixed(0)}%`}
      percentComplete={
        (character.sessionToLevelUp / character.maxSessionsToNextLevel) % 1
      }
    />
  );

  return (
    <Persona
      imageUrl={
        characterImages.find((charImg) => charImg.characterId === character.id)
          ?.imageUrl ?? imageUrl
      }
      text={character.name}
      secondaryText={`${character.ordinalLevel} level ${character.classes
        .map((characterClass) => characterClass.class)
        .join(", ")}`}
      tertiaryText={`Session Count: ${character.sessionCount}`}
      onRenderOptionalText={levelProgress}
      size={PersonaSize.size100}
    />
  );
};
