import { url } from "node:inspector";
import React, { useState, useEffect } from "react";
import { firestore } from "../firebase.utils";
import {
  deteremineSessionsAttended,
  calculateSessionsForLevelUp,
  getOrdinal,
} from "../Helpers/DataHelper";
import TextDivider from "./Stylistic/TextDivider";

const Character = ({ character, sessions }) => {
  const [imageUrl, setImageUrl] = useState("");

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
    return `${getTotalLevel()}${getOrdinal(getTotalLevel())} Level`;
  };

  return character ? (
    <div
      className="character-card"
      data-character-name={character.name}
      style={{ display: "flex", margin: "1em", flexShrink: 3 }}
    >
      <img
        style={{ height: 100, width: 100, objectFit: "cover" }}
        src={imageUrl}
      />
      <div style={{ marginLeft: "1em" }}>
        <div style={{ fontSize: "20px", fontWeight: "bold" }}>
          {getDisplayName()}
        </div>
        <div style={{ display: "flex" }}>
          <div>{getFormattedTotalLevel()}</div> <TextDivider />
          <div>{getRace()}</div>
          <TextDivider />
          <div>{getClasses()}</div>
        </div>
        <div>
          Session Count: {deteremineSessionsAttended(character, sessions)}
        </div>
        <div>
          Sessions to Level Up:{" "}
          {calculateSessionsForLevelUp(
            character["starting-level"],
            deteremineSessionsAttended(character, sessions)
          )}
        </div>
      </div>
    </div>
  ) : null;
};

export default Character;
