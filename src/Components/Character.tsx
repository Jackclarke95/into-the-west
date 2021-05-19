import { url } from "node:inspector";
import React, { useState, useEffect } from "react";
import { firestore } from "../firebase.utils";
import {
  deteremineSessionsAttended,
  calculateSessionsForLevelUp,
  getOrdinal,
} from "../Helpers/DataHelper";
import TextDivider from "./Stylistic/TextDivider";

const Character = ({ character, sessions, player = null as null | any }) => {
  const [imageUrl, setImageUrl] = useState("");
  console.log("character player:", player);

  let playerMatch = false;

  if (player) {
    let playerData;
    Object.keys(player).map((key) => {
      console.log("player:", player[key]);
      playerData = player[key];
    });

    if (playerData["dndbeyond-name"] === character["player-dndbeyond-name"]) {
      playerMatch = true;
    } else {
    }
  }

  console.log("match:", playerMatch);

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
        return b.level - a.level; // Sort by highest class level
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

  const getFormattedTotalLevel = () => {
    return `${getOrdinal(getTotalLevel())} Level`;
  };

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
          <div className="character-details">
            <div
              className="character-summary"
              style={{ display: "flex", fontWeight: 500 }}
            >
              <div className="character-level">{getFormattedTotalLevel()}</div>
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
        {playerMatch ? (
          <div
            className="edit-character-button"
            style={{
              position: "relative",
              right: 0,
              backgroundColor: "pink",
            }}
          >
            Edit
          </div>
        ) : null}
      </div>
    </div>
  ) : null;
};

export default Character;
