import React, { useState } from "react";
import Characters from "./ActiveCharacters";
import { getCharacterFromId } from "../Helpers/DataHelper";

const PastSession = ({ characters, session }) => {
  const getCharacterNames = () => {
    let characterNames = [] as string[];
    let playerNames = [] as string[];

    if (characters.length > 0) {
      if (session.characters) {
        session.characters.map((characterId) => {
          const characterName =
            getCharacterFromId(characterId, characters).nickname ??
            getCharacterFromId(characterId, characters).name;

          characterNames.push(characterName);
        });
      } else {
        session.players.map((player) => {
          characterNames.push(player.name);
        });
      }
    }

    return characterNames;
  };

  return (
    <div className="session" style={{ display: "flex" }}>
      <div style={{ marginRight: "1em", marginLeft: "1em" }}>
        <b>Name: </b>
        {session.name}
      </div>
      |
      <div style={{ marginRight: "1em", marginLeft: "1em" }}>
        <b>Date: </b>
        {session["scheduled-date"] ?? "N/A"}
      </div>
      |
      <div style={{ marginRight: "1em", marginLeft: "1em" }}>
        <b>DM: </b>
        {session["dungeon-master"] ?? "N/A"}
      </div>
      |
      <div style={{ marginRight: "1em", marginLeft: "1em" }}>
        <b>Players: </b>
        {session.players
          ? session.players.join(", ")
          : session.characters
          ? getCharacterNames().join(", ")
          : "N/A"}
      </div>
    </div>
  );
};

export default PastSession;
