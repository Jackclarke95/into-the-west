import React, { useEffect } from "react";
import { Persona, PersonaSize, ProgressIndicator } from "@fluentui/react/";
import ICharacter from "../Interfaces/ICharacter";
import { firestore } from "../firebase.utils";

export const CharacterPersona: React.FC<{
  character: ICharacter;
  characterImages: { characterId: number; imageUrl: string }[];
}> = ({ character, characterImages }) => {
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

  const getImageUrl = (): string => {
    var imageUrl = "";

    debugger;

    characterImages.forEach((charImg) => {
      if (charImg.characterId === character.id) {
        imageUrl = charImg.imageUrl;
      }
    });

    debugger;

    return imageUrl;
  };

  return (
    <Persona
      imageUrl={
        getImageUrl()
        // characterImages.find((charImg) => charImg.characterId === character.id)
        //   ?.imageUrl
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
