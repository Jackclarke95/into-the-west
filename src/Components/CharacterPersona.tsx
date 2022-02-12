import React from "react";
import { Persona, PersonaSize, ProgressIndicator } from "@fluentui/react/";
import ICharacter from "../Interfaces/ICharacter";
import { useDispatch, useSelector } from "react-redux";

export const CharacterPersona: React.FC<{
  character: ICharacter;
  characterImage: { characterId: number; imageUrl: string } | undefined;
  size: PersonaSize;
}> = ({ character, characterImage, size }) => {
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
      imageUrl={characterImage?.imageUrl}
      text={character.name}
      secondaryText={`${character.ordinalLevel} level ${character.classes
        .map((characterClass) => characterClass.class)
        .join(", ")}`}
      tertiaryText={`Session Count: ${character.sessionCount}`}
      onRenderOptionalText={levelProgress}
      size={size}
    />
  );
};
