import React from "react";
import { Character } from "../Types/LocalStructures";
import Card from "./Surfaces/Card";
import DefaultAvatar from "../Images/DefaultAvatar.jpeg";
import ClassIcon from "./ClassIcon";
import XpBar from "./XpBar";

const CharacterCard: React.FC<{ character: Character }> = ({ character }) => {
  const onRenderCharacterClasses = () => {
    return [...character.classes]
      .sort((a, b) => b.level - a.level)
      .map((cls) => (
        <div className="class-container">
          <ClassIcon key={cls.class} className={cls.class} />
          <div className="class-name">
            {character.classes.length > 1
              ? `${cls.class} (${cls.level})`
              : cls.class}
          </div>
        </div>
      ));
  };

  return (
    <Card>
      <div className="character-card">
        <div className="character-body">
          <img
            className="avatar"
            src={character.avatarUrl ?? DefaultAvatar}
            alt={`${character.fullName} Avatar`}
            title={`${character.fullName} Avatar`}
          />
          <div className="character-details">
            <h3 className="name">{character.fullName}</h3>
            <div className="classes">{onRenderCharacterClasses()}</div>
            <div className="race">{`${character.race.subrace ?? ""} ${
              character.race.race
            }`}</div>
          </div>
        </div>
        <XpBar character={character} />
      </div>
    </Card>
  );
};

export default CharacterCard;
