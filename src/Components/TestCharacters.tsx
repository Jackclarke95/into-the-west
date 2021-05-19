import React, { useState, useEffect } from "react";
import { firebaseDb } from "../firebase.utils";
import {
  deteremineSessionsAttended,
  calculateSessionsForLevelUp,
} from "../Helpers/DataHelper";

const TestCharacters = ({ characters, sessions }) => {
  const addCharacter = (character) => {
    firebaseDb.child("characters").push(character);
  };

  const updateCharacter = (key, character) => {
    firebaseDb.child(`characters/${key}`).update(character);
  };

  const deleteCharacter = (id) => {
    if (window.confirm("Are you sure to delete this record?")) {
      firebaseDb.child(`characters/${id}`).remove();
    }
  };

  return (
    <>
      <h2>Characters</h2>
      <table
        style={{
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <th>Character</th>
          <th>Race</th>
          <th>Starting Level</th>
          <th>Session Count</th>
          <th>Sessions to Level Up</th>
        </thead>
        <tbody>
          {Object.keys(characters).map((key, i) => {
            let character = characters[key];

            return (
              <tr
                key={key}
                data-id={key}
                style={{
                  backgroundColor: i % 2 !== 0 ? "lightgrey" : "white",
                }}
              >
                <td className="column name">
                  <a
                    className="avatar-link"
                    rel="noopener noreferrer"
                    target="_blank"
                    href={`https://www.dndbeyond.com/avatars/${character["avatar-link"]}`}
                  ></a>
                  <a
                    className="character-name"
                    rel="noopener noreferrer"
                    target="_blank"
                    href={`https://www.dndbeyond.com/profile/${character["player-dndbeyond-name"]}/characters/${character.id}`}
                  >
                    {character.nickname ? character.nickname : character.name}
                  </a>
                </td>
                <td>{character.race}</td>
                <td style={{ textAlign: "center" }}>
                  {character["starting-level"]}
                </td>
                <td style={{ textAlign: "center" }}>
                  {deteremineSessionsAttended(character, sessions)}
                </td>
                <td style={{ textAlign: "center" }}>
                  {calculateSessionsForLevelUp(
                    character["starting-level"],
                    deteremineSessionsAttended(character, sessions)
                  )}
                </td>
                <td>
                  <button
                    onClick={() => {
                      character["starting-level"] = 69;
                      updateCharacter(key, character);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      deleteCharacter(key);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default TestCharacters;
