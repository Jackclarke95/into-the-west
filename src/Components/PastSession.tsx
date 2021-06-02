import React, { useState } from "react";
import Characters from "./ActiveCharacters";
import { getCharacterFromId } from "../Helpers/DataHelper";

const PastSession = ({ characters, session }) => {
  const getCharacterNames = () => {
    let names = [] as string[];

    if (characters.length > 0) {
      if (session.characters) {
        session.characters.forEach((characterId) => {
          const characterName =
            getCharacterFromId(characterId, characters).nickname ??
            getCharacterFromId(characterId, characters).name;

          names.push(characterName);
        });
      } else {
        session.players.map((player) => {
          names.push(player.name);
        });
      }
    }

    return names;
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
