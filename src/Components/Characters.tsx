import React, { useState } from "react";
import CharacterCard from "./CharacterCard";

const Characters = ({ characters, sessions, player = null as null | any }) => {
  console.log(characters);
  return (
    <div style={{ textAlign: "center" }}>
      <h2>Characters</h2>
      <div className="characters" style={{ textAlign: "center" }}>
        <div className="character-cards">
          {Object.keys(characters).map((key) => (
            <CharacterCard
              key={key}
              character={characters[key]}
              characterKey={key}
              sessions={sessions}
              player={player}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Characters;
