import { url } from "node:inspector";
import React, { useState, useEffect } from "react";
import { firestore } from "../firebase.utils";

const Character = ({ character }) => {
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    firestore
      .ref(`Avatars/${character.name}.jpeg`)
      .getDownloadURL()
      .then((url) => {
        setImageUrl(url);
      })
      .catch((e) => console.log("Errors while downloading => ", e));
  }, []);

  const getDisplayName = () => {
    return character.nickname ? character.nickname : character.name;
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
        classList.push(`${characterClass.class} (${characterClass.level})`);
      });

    return classList.join(", ");
  };

  const getTotalLevel = () => {
    let totalLevel = 0;

    character.classes.map((characterClass) => {
      totalLevel += characterClass.level;
    });

    return totalLevel;
  };

  const getFormattedTotalLevel = () => {
    const level = getTotalLevel();
    let prefix;

    switch (level) {
      case 1:
        prefix = "st";
        break;

      case 2:
        prefix = "nd";
        break;

      case 3:
        prefix = "rd";
        break;

      default:
        prefix = "th";
        break;
    }

    return `${level}${prefix} Level`;
  };

  const getStartingLevel = () => {
    return character["starting-level"];
  };

  return character ? (
    <>
      <h3>{getDisplayName()}</h3>
      <h4>{getRace()}</h4>
      <div>{`${getFormattedTotalLevel()}`}</div>
      <div>{`${getClasses()}}`}</div>
      <img
        style={{ height: 50, width: 50, objectFit: "cover" }}
        src={imageUrl}
      />
    </>
  ) : null;
};

export default Character;
