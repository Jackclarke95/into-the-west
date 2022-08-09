import React from "react";
import { Character } from "../Types/LocalStructures";
import Card from "./Surfaces/Card";
import "./CharacterCard.scss";

const CharacterCard: React.FC<{ character: Character }> = ({ character }) => {
  return (
    <Card>
      <div className="character-card">
        <img
          className="avatar"
          src={character.avatarUrl}
          alt="Character Avatar URL"
          title={`${character.fullName} Avatar`}
        />
        <div className="title">{character.fullName}</div>
      </div>
    </Card>
  );
};

export default CharacterCard;
