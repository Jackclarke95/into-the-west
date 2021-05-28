import React, { useState, useEffect } from "react";
import {
  getCharacterFromId,
  getActiveCharactersFromPlayer,
} from "../Helpers/DataHelper";
import { firebaseDb } from "../firebase.utils";

const FutureSession = ({
  currentPlayer = null as null | any,
  characters,
  session,
  sessionKey,
}) => {
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

  let matchingCharacters = [] as any[];

  if (currentPlayer) {
    matchingCharacters = getActiveCharactersFromPlayer(
      currentPlayer,
      characters
    );
  }

  const signUpToSession = () => {
    if (matchingCharacters.length === 1) {
      session.characters.push(matchingCharacters[0].id);
    }

    firebaseDb
      .child(`sessions/${sessionKey}`)
      .update(session)
      .then(() => {
        window.location.reload();
      })
      .catch((e) =>
        alert(
          `Unable to sign up for session. Verify that you are connected to the internet. Please try again.\n\nDetails:\n${e}`
        )
      );
  };

  const unsignFromSession = () => {
    console.log("unsigning");
    const index = session.characters.indexOf(matchingCharacters[0].id);
    console.log(index);
    if (index !== -1) {
      session.characters.splice(index);
    }

    firebaseDb
      .child(`sessions/${sessionKey}`)
      .update(session)
      .then(() => {
        window.location.reload();
      })
      .catch((e) =>
        alert(
          `Unable to unsign from session. Verify that you are connected to the internet. Please try again.\n\nDetails:\n${e}`
        )
      );
  };

  const singleCharacter = matchingCharacters.length === 1;

  return (
    <div
      className="session"
      style={{ display: "flex", flexDirection: "column" }}
    >
      <div
        className="session-name"
        style={{
          textAlign: "center",
          padding: "0.2em",
          marginBottom: "0.3em",
          borderBottom: "solid 1px grey",
          fontSize: "20px",
          fontWeight: "bold",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
          flexGrow: 1,
        }}
      >
        {session.name}
      </div>

      <div
        className="session-card-content"
        style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
      >
        <div className="session-details" style={{ display: "flex" }}>
          <div className="session-dungeon-master" style={{ width: "20%" }}>
            <b>DM: </b>
            {session["dungeon-master"]}
          </div>
          <div className="session-date" style={{ width: "30%" }}>
            <b>Date: </b>
            {session["scheduled-date"]
              ? new Date(session["scheduled-date"]).toLocaleDateString(
                  "en-UK",
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }
                )
              : "To be scheduled"}
          </div>
          {session.characters ? (
            <div className="session-characters" style={{ width: "50%" }}>
              <b>Characters: </b>
              {getCharacterNames().join(", ")}
            </div>
          ) : (
            <div className="session-players" style={{ width: "50%" }}>
              <b>Players: </b>
              {getCharacterNames()}
            </div>
          )}
        </div>
        <div className="session-card-body" style={{ display: "flex" }}>
          <div
            className="session-description"
            style={{ padding: "0.2em", flexGrow: 1 }}
          >
            {session.description}
          </div>
          {currentPlayer && session.characters ? (
            <div
              style={{ alignSelf: "flex-end" }}
              className="session-sign-up-button"
            >
              {!matchingCharacters.some((character) => {
                console.log(character);
                return session.characters.includes(character.id);
              }) ? (
                <button onClick={signUpToSession}>Sign Up</button>
              ) : (
                <button onClick={unsignFromSession}>Unsign</button>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default FutureSession;
