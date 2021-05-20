import { url } from "node:inspector";
import React, { useState, useEffect } from "react";
import { firestore, firebaseDb } from "../firebase.utils";
import {
  deteremineSessionsAttended,
  calculateSessionsForLevelUp,
  calculateLevelFromSessions,
  countSessionsAttended,
  getOrdinal,
} from "../Helpers/DataHelper";
import TextDivider from "./Stylistic/TextDivider";

const Character = ({
  character,
  characterKey,
  sessions,
  player = null as null | any,
}) => {
  const [imageUrl, setImageUrl] = useState("");

  const updateCharacter = (key, character) => {
    character.name = character.name;
    firebaseDb.child(`characters/${key}`).update(character);
  };

  const getDisplayName = () => {
    return character.nickname
      ? `${character.name} (${character.nickname})`
      : character.name;
  };

  const getRace = () => {
    return `${character.subrace ? `${character.subrace} ` : ""}${
      character.race
    }`;
  };

  const getClasses = () => {
    let classList = [] as string[];

    character.classes
      .sort((a, b) => {
        return b.level - a.level; // Sort by class with most levels
      })
      .map((characterClass) => {
        classList.push(characterClass.class);
      });

    return classList.join("/");
  };

  const getTotalLevel = () => {
    let totalLevel = 0;

    character.classes.map((characterClass) => {
      totalLevel += characterClass.level;
    });

    return totalLevel;
  };

  const getCorrectLevel = () => {
    return calculateLevelFromSessions(
      character["starting-level"],
      countSessionsAttended(character, sessions)
    );
  };

  const getFormattedTotalLevel = () => {
    return `${getOrdinal(getTotalLevel())} Level`;
  };

  const getFormattedCorrectLevel = () => {
    return `${getOrdinal(getCorrectLevel())} Level`;
  };

  let playerMatch = false;

  if (player) {
    let playerData;
    Object.keys(player).map((key) => {
      playerData = player[key];
    });

    if (playerData["dndbeyond-name"] === character["player-dndbeyond-name"]) {
      playerMatch = true;
    } else {
    }
  }

  useEffect(() => {
    firestore
      .ref(`Avatars/${character.name}.jpeg`)
      .getDownloadURL()
      .then((url) => {
        setImageUrl(url);
      })
      .catch((e) =>
        setImageUrl(
          "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/characters/default-avatar-builder.png"
        )
      );
  }, []);

  return character ? (
    <div
      className="character-card"
      data-character-name={character.name}
      style={{
        display: "inline-block",
        margin: "0.5em",
        padding: "0.5em",
        backgroundColor: "#eeeeee",
        width: "30em",
        textAlign: "start",
      }}
    >
      <div style={{ display: "flex" }}>
        <img
          className="character-image"
          style={{ height: 100, width: 100, objectFit: "cover" }}
          src={imageUrl}
        />
        <div
          className="character-card-data"
          style={{ marginLeft: "1em", flexGrow: 1 }}
        >
          <div
            className="character-name"
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {getDisplayName()}
          </div>
          <div style={{ display: "flex" }} className="character-card-data-body">
            <div style={{ flexGrow: 1 }} className="character-details">
              <div
                className="character-summary"
                style={{ display: "flex", fontWeight: 500 }}
              >
                <div
                  title={
                    getCorrectLevel() !== getTotalLevel()
                      ? "Missing level data (speak to Jack)"
                      : ""
                  }
                  className="character-level"
                  style={
                    getCorrectLevel() !== getTotalLevel()
                      ? { color: "red" }
                      : {}
                  }
                >
                  {getFormattedCorrectLevel()}
                </div>
                <TextDivider />
                <div className="character-race">{getRace()}</div>
                <TextDivider />
                <div className="character-classes">{getClasses()}</div>
              </div>
              <div className="character-session-count">
                Session Count: {deteremineSessionsAttended(character, sessions)}
              </div>
              <div className="character-sessions-to-level">
                Sessions to Level Up:{" "}
                {calculateSessionsForLevelUp(
                  character["starting-level"],
                  deteremineSessionsAttended(character, sessions)
                )}
              </div>
            </div>
            {playerMatch ? (
              <div
                className="edit-character-button"
                style={{
                  position: "relative",
                  right: 0,
                  display: "flex",
                  alignItems: "flex-end",
                  marginRight: "1em",
                  // cursor: "pointer",
                }}
              >
                <img
                  onClick={() => updateCharacter(characterKey, character)}
                  title="Edit"
                  style={{ cursor: "pointer" }}
                  src={process.env.PUBLIC_URL + "/Images/settings-cog.svg"}
                  height={24}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  ) : null;
};

export default Character;
