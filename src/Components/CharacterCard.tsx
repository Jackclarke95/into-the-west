import { useState, useEffect } from "react";
import {
  MdAdd,
  MdArrowUpward,
  MdModeEdit,
  MdSave,
  MdFileUpload,
} from "react-icons/md";
import { firestore, firebaseDb } from "../firebase.utils";
import {
  deteremineSessionsAttended,
  calculateSessionsForLevelUp,
  calculateLevelFromSessions,
  countSessionsAttended,
  getOrdinal,
  getMainClass,
} from "../Helpers/DataHelper";

const CharacterCard = ({
  character,
  characterKey,
  sessions,
  player = null as null | any,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [edit, setEdit] = useState(false);
  const [levelUp, setLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState("");
  const [newImage, setNewImage] = useState([] as any[]);
  const [characterName, setCharacterName] = useState(character.name as string);
  const [characterNickName, setCharacterNickName] = useState(
    character.nickname ?? (null as string | null)
  );

  const saveNewName = () => {
    if (
      !characterName ||
      characterName === "" ||
      (characterName.includes(" ") &&
        (characterNickName === "" || !characterNickName))
    ) {
      return;
    } else {
      updateCharacterName();
      setEdit(!edit);
    }
  };

  const saveNewLevel = () => {
    const characterClasses = character.classes;
    let addNew = false;

    characterClasses.forEach((characterClass) => {
      if (characterClass.class === newLevel) {
        characterClass.level++;
      } else {
        addNew = true;
      }
    });

    if (addNew) {
      characterClasses.push({ class: newLevel, level: 1 });
    }

    setLevelUp(!levelUp);
    character.classes = characterClasses;

    firebaseDb
      .child(`characters/${characterKey}`)
      .update(character)
      .then(() => {
        window.location.reload();
      })
      .catch((e) =>
        alert(
          `Unable to update Character. This could be because you are not conected to the internet. Please try again.\n\nDetails:\n${e}`
        )
      );

    setNewLevel("");
  };

  const updateCharacterName = () => {
    character.name = characterName.trim();
    character.nickname = characterName.includes(" ")
      ? characterNickName.trim()
      : null;
    firebaseDb
      .child(`characters/${characterKey}`)
      .update(character)
      .catch((e) =>
        alert(
          `Unable to update Character. This could be because you are not conected to the internet. Please try again.\n\nDetails:\n${e}`
        )
      );
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
      .forEach((characterClass) => {
        classList.push(characterClass.class);
      });

    return classList.join("/");
  };

  const getTotalLevel = () => {
    let totalLevel = 0;

    character.classes.forEach((characterClass) => {
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

  const uploadImage = (e) => {
    const file = e.target.files[0];
    setNewImage(file);

    firestore
      .ref(`Avatars/${character.id}.jpeg`)
      .put(file)
      .then(() => {
        window.location.reload();
      })
      .catch((e) =>
        alert(
          `Unable to upload image. This could be because you are not conected to the internet. Please try again.\n\nDetails:\n${e}`
        )
      );
  };

  useEffect(() => {
    firestore
      .ref(`Avatars/${character.id}.jpeg`)
      .getDownloadURL()
      .then((url) => {
        setImageUrl(url);
      })
      .catch((e) =>
        setImageUrl(
          "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/characters/default-avatar-builder.png"
        )
      );
  }, [character.id]);

  const getClassColour = () => {
    let characterClass = getMainClass(character);

    switch (characterClass) {
      case "Artificer":
        return "#d5913a";

      case "Barbarian":
        return "#e7623e";

      case "Bard":
        return "#ab6dac";

      case "Cleric":
        return "#91a1b2";

      case "Druid":
        return "#7a853b";

      case "Fighter":
        return "#7f513e";

      case "Monk":
        return "#51a5c5";

      case "Paladin":
        return "#b59e54";

      case "Ranger":
        return "#507f62";

      case "Rogue":
        return "#555752";

      case "Sorcerer":
        return "#992e2e";

      case "Warlock":
        return "#7b469b";

      case "Wizard":
        return "#2a50a1";

      default:
        return "black";
    }
  };

  let playerMatch =
    player && player["dndbeyond-name"] === character["player-dndbeyond-name"];

  const levelMatch = getFormattedTotalLevel() === getFormattedCorrectLevel();

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
            alt={`${character.name} Avatar`}
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
              onClick={() => {
                document.getElementById("image-upload")?.click();
              }}
              className="edit-character-button"
              title="Replace Image"
              style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "0.2em 0",
                cursor: "pointer",
              }}
            >
              <input
                id="image-upload"
                type="file"
                hidden
                onChange={uploadImage}
              />
              <MdFileUpload
                title="Replace Image"
                color="white"
                size="3em"
                style={{
                  textAlign: "end",
                }}
              />
            </div>
          ) : null}
        </div>
        <span
          className="character-card-data"
          style={{ marginLeft: "0.5em", width: "420px", flexGrow: 1 }}
        >
          <div
            className="character-card-data-title"
            style={{
              display: "flex",
              borderBottomStyle: "solid",
              borderBottomWidth: 3,
              borderBottomColor: getClassColour(),
              paddingBottom: "1px",
              marginBottom: "1px",
            }}
          >
            {edit ? (
              <div
                className="input-character-names"
                style={{ display: "flex", width: "421px" }}
              >
                <input
                  type="text"
                  placeholder="Full Name"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  onBlur={(e) => setCharacterName(e.target.value.trim())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      saveNewName();
                    }
                  }}
                  className="input-character-name"
                  style={{
                    fontSize: "18px",
                    width: "200px",
                    borderColor:
                      characterName === "" || !characterName ? "red" : "",
                  }}
                />
                <input
                  type="text"
                  title="Type a nickname/display name if your character has more than 1 name"
                  placeholder="Nickname"
                  disabled={!characterName.includes(" ")}
                  value={characterNickName ?? null}
                  onChange={(e) => setCharacterNickName(e.target.value)}
                  onBlur={(e) => setCharacterNickName(e.target.value.trim())}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      saveNewName();
                    }
                  }}
                  className="input-character-name-nickname"
                  style={{
                    fontSize: "18px",
                    width: "200px",
                    marginLeft: "0.25em",
                    borderColor:
                      (characterName.includes(" ") &&
                        (characterNickName === "" || !characterNickName)) ||
                      (characterNickName && characterNickName.includes(" "))
                        ? "red"
                        : "",
                  }}
                />
                {characterName.includes(" ") ? (
                  <div
                    style={{
                      fontStyle: "italic",
                      color: characterNickName ? "black" : "red",
                    }}
                  />
                ) : null}
              </div>
            ) : (
              <div
                className="character-name"
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  width: "421px",
                }}
              >
                {getDisplayName()}
              </div>
            )}
            {playerMatch ? (
              !edit ? (
                <button
                  className="edit-button"
                  title="Edit Name"
                  disabled={
                    (characterName.includes(" ") &&
                      (characterNickName === "" || !characterNickName)) ||
                    (characterNickName && characterNickName.includes(" "))
                  }
                  onClick={() => setEdit(!edit)}
                  style={{
                    color: "white",
                    display: "flex",
                    cursor: "pointer",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "2em",
                    width: "2em",
                    border: "none",
                    borderRadius: 0,
                    marginLeft: "5px",
                    backgroundColor: "grey",
                  }}
                >
                  <MdModeEdit size="1.5em" style={{ cursor: "pointer" }} />
                </button>
              ) : (
                <button
                  className="save-button"
                  title="Save Name"
                  disabled={
                    (characterName.includes(" ") &&
                      (characterNickName === "" || !characterNickName)) ||
                    (characterNickName && characterNickName.includes(" "))
                  }
                  onClick={saveNewName}
                  style={{
                    color: "white",
                    display: "flex",
                    cursor: "pointer",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "2em",
                    width: "2em",
                    border: "none",
                    borderRadius: 0,
                    marginLeft: "5px",
                    backgroundColor: "green",
                  }}
                >
                  <MdSave
                    size="1.5em"
                    style={{ alignSelf: "center" }}
                    color="white"
                  />
                </button>
              )
            ) : null}
          </div>
          <div style={{ display: "flex" }} className="character-card-data-body">
            <div style={{ flexGrow: 1 }} className="character-details">
              {!levelUp ? (
                <div className="character-summary" style={{ fontWeight: 500 }}>
                  {getFormattedTotalLevel()} | {getRace()} | {getClasses()}
                </div>
              ) : (
                <div
                  className="character-level-up-form"
                  style={{ marginBottom: "-1px" }}
                >
                  Choose class for new level:
                  <select
                    onChange={(e) => setNewLevel(e.target.value)}
                    style={{ marginLeft: "0.5em" }}
                    value={newLevel}
                  >
                    <option>Artificer</option>
                    <option>Barbarian</option>
                    <option>Bard</option>
                    <option>Cleric</option>
                    <option>Druid</option>
                    <option>Fighter</option>
                    <option>Monk</option>
                    <option>Paladin</option>
                    <option>Ranger</option>
                    <option>Rogue</option>
                    <option>Sorcerer</option>
                    <option>Warlock</option>
                    <option>Wizard</option>
                  </select>
                </div>
              )}
              <div className="character-session-count">
                Session Count: {deteremineSessionsAttended(character, sessions)}
              </div>
              <div className="character-sessions-to-level">
                {levelMatch ? (
                  `Sessions to Level Up: ${calculateSessionsForLevelUp(
                    character["starting-level"],
                    deteremineSessionsAttended(character, sessions)
                  )}`
                ) : (
                  <b>Level Up Available!</b>
                )}
              </div>
            </div>
            {playerMatch && !levelMatch ? (
              !levelUp ? (
                <MdArrowUpward
                  title="Level Up!"
                  className="level-up-button"
                  onClick={() => {
                    setNewLevel(getMainClass(character));
                    setLevelUp(!levelUp);
                  }}
                  size="3em"
                  strokeWidth={2}
                  style={{
                    alignSelf: "center",
                    cursor: "pointer",
                  }}
                  color="green"
                />
              ) : (
                <MdAdd
                  title="Level Up!"
                  className="save-level-up-button"
                  onClick={saveNewLevel}
                  size="3em"
                  strokeWidth={2}
                  style={{
                    alignSelf: "center",
                    cursor: "pointer",
                  }}
                  color="grey"
                />
              )
            ) : null}
          </div>
        </span>
      </div>
    </div>
  ) : (
    <div>Loading</div>
  );
};

export default CharacterCard;
