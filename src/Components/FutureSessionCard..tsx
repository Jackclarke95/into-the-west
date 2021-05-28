import React, { useState, useEffect } from "react";
import {
  getCharacterFromId,
  getActiveCharactersFromPlayer,
  getPlayerDisplayNameFromName,
  getPlayerFromName,
} from "../Helpers/DataHelper";
import { firebaseDb } from "../firebase.utils";

const FutureSession = ({
  currentPlayer = null as null | any,
  characters,
  players,
  session,
  sessionKey,
}) => {
  const getCharacterNames = () => {
    let names = [] as string[];

    if (characters !== undefined && characters.length > 0) {
      if (session.characters && session.characters.length > 0) {
        session.characters.map((characterId) => {
          const characterName =
            getCharacterFromId(characterId, characters).nickname ??
            getCharacterFromId(characterId, characters).name;

          names.push(characterName);
        });
      } else if (session.players) {
        session.players.map((player) => {
          let playerName;
          if (currentPlayer) {
            playerName = getPlayerDisplayNameFromName(player, players);
          } else {
            playerName = player;
          }
          names.push(playerName);
        });
      }
    }

    return names;
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
    const index = session.characters.indexOf(matchingCharacters[0].id);

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
        className="session-card-title"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0.2em",
          marginBottom: "0.3em",
          borderBottom: "solid 1px grey",
        }}
      >
        <div
          className="session-name"
          style={{
            fontWeight: "bold",
            fontSize: "20px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            flexGrow: 1,
          }}
        >
          {session.name}
        </div>
        <div className="session-dungeon-master" style={{}}>
          <b>DM: </b>
          {session["dungeon-master"]
            ? currentPlayer
              ? getPlayerDisplayNameFromName(session["dungeon-master"], players)
              : session["dungeon-master"]
            : "No DM Assigned"}
        </div>
      </div>
      <div
        className="session-card-content"
        style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
      >
        <div className="session-details" style={{ display: "flex" }}>
          <div className="session-date" style={{ width: "30%" }}>
            <b>Date: </b>
            {session["scheduled-date"]
              ? new Date(session["scheduled-date"]).toLocaleDateString(
                  "en-UK",
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
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
              {getCharacterNames().join(", ")}
            </div>
          )}
        </div>
        <div className="session-card-body" style={{ display: "flex" }}>
          <div
            className="session-description"
            style={{ padding: "0.2em", flexGrow: 1, fontStyle: "italic" }}
          >
            {session.description ?? "No description provided"}
          </div>
          {currentPlayer && session.characters ? (
            <div
              style={{ alignSelf: "flex-end" }}
              className="session-sign-up-button"
            >
              {!matchingCharacters.some((character) =>
                session.characters.includes(character.id)
              ) ? (
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
