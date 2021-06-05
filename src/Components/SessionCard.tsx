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
  const [selectedCharacterId, setSelectedCharacterId] = useState(0);
  const [scheduledDate, setScheduledDate] = useState("");

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

  let playersCharacters = [] as any[];

  if (currentPlayer) {
    playersCharacters = getActiveCharactersFromPlayer(
      currentPlayer,
      characters
    );
  }

  const singleCharacter = playersCharacters.length === 1;

  if (playersCharacters.length > 0 && selectedCharacterId === 0) {
    setSelectedCharacterId(playersCharacters[0].id);
  }

  const signUpToSession = () => {
    if (!session.characters) {
      session.characters = [] as number[];
    }

    session.characters.push(selectedCharacterId);

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
    playersCharacters.forEach((character) => {
      const index = session.characters.indexOf(character.id);

      if (index !== -1) {
        session.characters.splice(index);
      }

      firebaseDb
        .child(`sessions/${sessionKey}`)
        .update(session)
        .then(() => {})
        .catch((e) =>
          alert(
            `Unable to unsign from session. Verify that you are connected to the internet. Please try again.\n\nDetails:\n${e}`
          )
        );
    });

    window.location.reload();
  };

  let currentPlayerRecord;

  if (currentPlayer) {
    currentPlayerRecord = players.filter((player) => {
      return currentPlayer["dndbeyond-name"] === player["dndbeyond-name"];
    })[0];
  }

  const volunteerAsDm = () => {
    session["dungeon-master"] = currentPlayerRecord["dndbeyond-name"];

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

  const saveSessionDate = () => {
    session["scheduled-date"] = scheduledDate;

    console.log("scheduled:", scheduledDate);
    console.log("session:", session);

    firebaseDb
      .child(`sessions/${sessionKey}`)
      .update(session)
      .then(() => {
        window.location.reload();
      })
      .catch((e) =>
        alert(
          `Unable to schedule session. Verify that you are connected to the internet. Please try again.\n\nDetails:\n${e}`
        )
      );
  };

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
        <div
          className="session-dungeon-master"
          style={{ whiteSpace: "nowrap" }}
        >
          <b>DM: </b>
          {currentPlayer ? (
            session["dungeon-master"] ? (
              <div>
                {getPlayerDisplayNameFromName(
                  session["dungeon-master"],
                  players
                )}
              </div>
            ) : currentPlayerRecord["dungeon-master"] === true ? (
              <button onClick={volunteerAsDm}>Volunteer as DM!</button>
            ) : (
              "No DM Assigned"
            )
          ) : (
            <div>{session["dungeon-master"]}</div>
          )}
        </div>
      </div>
      <div
        className="session-card-body"
        style={{
          display: "flex",
          flexDirection: "row",
          flexGrow: 1,
          padding: "0.2em",
        }}
      >
        <div
          className="session-card-content"
          style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
        >
          <div className="session-details" style={{ display: "flex" }}>
            <div
              className="session-date"
              style={{
                width: "30%",
                display: "flex",
                alignItems: "flex-start",
              }}
            >
              <b style={{ paddingRight: "0.5em" }}>Date:</b>
              {session["scheduled-date"] ? (
                new Date(session["scheduled-date"]).toLocaleDateString(
                  "en-UK",
                  {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }
                )
              ) : (
                <>
                  <input
                    type="date"
                    onChange={(e) =>
                      setScheduledDate(e.target.value.replaceAll("-", " "))
                    }
                  />
                  <button
                    onClick={saveSessionDate}
                    disabled={scheduledDate.length === 0}
                  >
                    Schedule
                  </button>
                </>
              )}
            </div>
            {session.characters ? (
              <div className="session-characters" style={{ width: "50%" }}>
                <b style={{ paddingRight: "0.5em" }}>Characters:</b>
                {getCharacterNames().join(", ")}
              </div>
            ) : (
              <div className="session-players" style={{ width: "50%" }}>
                <b style={{ paddingRight: "0.5em" }}>Players:</b>
                {getCharacterNames().join(", ")}
              </div>
            )}
          </div>
          <div
            className="session-description"
            style={{ padding: "0.2em", flexGrow: 1, fontStyle: "italic" }}
          >
            {session.description ?? "No description provided"}
          </div>
        </div>
        {currentPlayer ? (
          <div
            className="session-sign-up-button"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "0.2em",
            }}
          >
            {!session.characters ? (
              <button
                onClick={signUpToSession}
                style={{ width: "100%", whiteSpace: "nowrap" }}
              >
                Sign Up
              </button>
            ) : !playersCharacters.some((character) =>
                session.characters.includes(character.id)
              ) ? (
              singleCharacter ? (
                <button
                  onClick={signUpToSession}
                  style={{ width: "100%", whiteSpace: "nowrap" }}
                >
                  Sign Up
                </button>
              ) : (
                <>
                  <div style={{ marginBottom: "0.3em" }}>Sign Up</div>
                  <select
                    onChange={(e) => {
                      setSelectedCharacterId(parseInt(e.target.value));
                    }}
                    style={{
                      marginTop: "0.2em",
                      marginBottom: "0.3em",
                    }}
                    value={selectedCharacterId}
                  >
                    {playersCharacters.map((character) => {
                      return (
                        <option value={character.id}>
                          {character.nickname ?? character.name}
                        </option>
                      );
                    })}
                  </select>
                  <button
                    onClick={signUpToSession}
                    style={{ width: "100%", whiteSpace: "nowrap" }}
                  >
                    Sign Up
                  </button>
                </>
              )
            ) : (
              <button
                onClick={unsignFromSession}
                style={{ width: "100%", whiteSpace: "nowrap" }}
              >
                Unsign
              </button>
            )}
          </div>
        ) : (
          <div>hello</div>
        )}
      </div>
    </div>
  );
};

export default FutureSession;
