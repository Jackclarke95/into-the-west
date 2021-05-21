import { truncate } from "node:fs";
import React, { useState, useEffect } from "react";
import { MdModeEdit, MdFileUpload } from "react-icons/md";
import { firestore, firebaseDb } from "../firebase.utils";
import {
  deteremineSessionsAttended,
  calculateSessionsForLevelUp,
  calculateLevelFromSessions,
  countSessionsAttended,
  getOrdinal,
} from "../Helpers/DataHelper";
import TextDivider from "./Stylistic/TextDivider";

const CharacterCard = ({
  character,
  characterKey,
  sessions,
  player = null as null | any,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [edit, setEdit] = useState(false);

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

  const levelMatch = getCorrectLevel() !== getTotalLevel();

  return character ? (
    <div
      className="character-card"
      data-character-name={character.name}
      style={{
        display: "inline-block",
        margin: "0.5em",
        padding: "0.5em",
        backgroundColor: "#eeeeee",
        width: "35em",
        textAlign: "start",
      }}
    >
      <div style={{ display: "flex" }}>
        <div
          className="character-image-container"
          style={{
            position: "relative",
            display: "flex",
          }}
        >
          <img
            className="character-image"
            style={{
              position: "relative",
              height: 100,
              width: 100,
              objectFit: "cover",
            }}
            src={imageUrl}
          />
          {playerMatch && edit ? (
            <div
              className="edit-character-button"
              title="Replace Image"
              style={{
                position: "absolute",
                bottom: "0",
                width: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                display: "flex",
                justifyContent: "center",
                padding: "0.2em 0",
                cursor: "pointer",
              }}
            >
              <MdFileUpload
                onClick={() => updateCharacter(characterKey, character)}
                title="Replace Image"
                color="white"
                size="1.5em"
                style={{
                  textAlign: "end",
                }}
              />
            </div>
          ) : null}
        </div>
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
                  title={levelMatch ? "Missing level data (speak to Jack)" : ""}
                  className="character-level"
                  style={levelMatch ? { color: "red" } : {}}
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
          </div>
        </div>
        {!edit ? (
          <div className="edit-character-button">
            <MdModeEdit
              onClick={() => setEdit(!edit)}
              title="Edit"
              style={{ cursor: "pointer" }}
            />
          </div>
        ) : (
          <button onClick={() => setEdit(!edit)}>Save</button>
        )}
      </div>
    </div>
  ) : null;
};

export default CharacterCard;
