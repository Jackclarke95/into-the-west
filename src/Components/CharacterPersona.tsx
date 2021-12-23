import React from "react";
import { Persona, PersonaSize, ProgressIndicator } from "@fluentui/react/";
import ICharacter from "../Interfaces/ICharacter";

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

    characterImages.forEach((charImg) => {
      if (charImg.characterId === character.id) {
        imageUrl = charImg.imageUrl;
      }
    });

    return imageUrl;
  };

  return (
    <Persona
      imageUrl={getImageUrl()}
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
