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
  getClasses,
} from "../Helpers/DataHelper";

const CharacterCard = ({
  character,
  characterKey,
  sessions,
  player,
  currentUser = null as null | any,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [edit, setEdit] = useState(false);
  const [levelUp, setLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState("");
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
    let addNew = true;

    characterClasses.forEach((characterClass) => {
      if (characterClass.class === newLevel) {
        addNew = false;
      }
    });

    if (addNew) {
      characterClasses.push({ class: newLevel, level: 1 });
    } else {
      characterClasses.forEach((characterClass) => {
        if (characterClass.class === newLevel) {
          characterClass.level++;
        }
      });
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
          `Failed to update Character. This could be because you are not conected to the internet. Please try again.\n\nDetails:\n${e}`
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

  const getFormattedClasses = () => {
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

    if (!file || file === undefined) {
      return;
    }

    let errorMessage = [] as string[];

    if (
      file.type !== "image/jpeg" &&
      file.type !== "image/jpg" &&
      file.type !== "image/png"
    ) {
      errorMessage.push(
        'Wrong file type. Please ensure the file type is "jpg", "jpeg", or "png".'
      );
    }

    if (file.size > 2_000_000) {
      errorMessage.push(
        "File size too big. Please ensure the file is less than 2MB."
      );
    }

    if (errorMessage.length > 0) {
      alert(
        `Could not upload image.\n\nDetails:\n-${errorMessage.join("\n-")}`
      );
    } else {
      firestore
        .ref(`Avatars/${character.id}.jpeg`)
        .put(file)
        .then(() => {
          window.location.reload();
        })
        .catch((e) =>
          alert(
            `Failed to upload image. This could be because you are not conected to the internet. Please try again.\n\nDetails:\n${e}`
          )
        );
    }
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
        return "#d59139";

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
    currentUser &&
    currentUser["dndbeyond-name"] === character["player-dndbeyond-name"];

  const levelMatch = getFormattedTotalLevel() === getFormattedCorrectLevel();
  const characterClasses = getClasses(character);

  return character ? (
    <div
      className="character-card"
      data-character-name={character.name}
      style={{
        display: "inline-block",
        margin: "0.5em",
        padding: "0.5em",
        backgroundColor: "#ffffff",
        width: "35em",
        textAlign: "start",
        borderTopLeftRadius: "10em",
        borderBottomLeftRadius: "10em",
      }}
    >
      <div style={{ display: "flex" }}>
        <div
          className="character-image-container"
          style={{
            position: "relative",
            display: "flex",
            boxSizing: "border-box",
             borderWidth: "4px",
            borderStyle: "solid",
            borderColor: getClassColour(),
            borderRadius: "50%",
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
              borderRadius: "50%",
            }}
            src={imageUrl}
          />
          {playerMatch && edit ? (
            <div
              onClick={() => {
                document.getElementById("image-upload")?.click();
              }}
              className="replace-avatar-button"
              title="Replace Image"
              style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                backgroundColor: "rgba(255, 255, 255, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                borderRadius: "50%",
              }}
            >
              <input
                id="image-upload"
                type="file"
                accept=".jpeg,.jpg,png"
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
              <>
                <div
                  className="character-class-icons"
                  style={{ display: "flex" }}
                >
                  {characterClasses.map((characterClass, key) => {
                    return (
                      <img
                        key={key}
                        alt={`${character.name} Class Icon`}
                        title={`${characterClass} Icon`}
                        className="character-class"
                        style={{
                          position: "relative",
                          height: 25,
                          width: 25,
                          objectFit: "cover",
                          marginRight: "0.5em",
                          borderRadius: "50%",
                        }}
                        src={`${process.env.PUBLIC_URL}/Images/ClassIcons/${characterClass}.jpeg`}
                      />
                    );
                  })}
                </div>
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
              </>
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
                    border: "none",
                    cursor: "pointer",
                    background: "none",
                  }}
                >
                  <MdModeEdit
                    size="1.5em"
                    style={{ cursor: "pointer" }}
                    color={getClassColour()}
                  />
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
                    cursor: "pointer",
                    border: "none",
                    background: "none",
                  }}
                >
                  <MdSave
                    size="1.5em"
                    style={{ alignSelf: "center" }}
                    color={getClassColour()}
                  />
                </button>
              )
            ) : null}
          </div>
          <div style={{ display: "flex" }} className="character-card-data-body">
            <div style={{ flexGrow: 1 }} className="character-details">
              {!levelUp ? (
                <div className="character-summary" style={{ fontWeight: 500 }}>
                  {getFormattedTotalLevel()} | {getRace()} |{" "}
                  {getFormattedClasses()}
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
              <div
                className="character-session-count"
                style={{ marginRight: "1em" }}
              >
                {`Session Count: ${deteremineSessionsAttended(
                  character,
                  sessions
                )} | `}
                {levelMatch ? (
                  `Level Up In ${calculateSessionsForLevelUp(
                    character["starting-level"],
                    deteremineSessionsAttended(character, sessions)
                  )} Session${
                    calculateSessionsForLevelUp(
                      character["starting-level"],
                      deteremineSessionsAttended(character, sessions)
                    ) > 1
                      ? "s"
                      : ""
                  }`
                ) : (
                  <b>Level Up Available!</b>
                )}
              </div>
              <div
                className="character-player-details"
                style={{ display: "flex" }}
              >
                {player["display-name"] ? (
                  <div>
                    <b>Player: </b>
                    {player["display-name"]}
                  </div>
                ) : null}
                {player["display-name"] && player.discord ? (
                  <div style={{ marginRight: "0.3em", marginLeft: "0.3em" }}>
                    |
                  </div>
                ) : null}
                {player.discord ? (
                  <div>
                    <b>Discord: </b>
                    {player.discord}
                  </div>
                ) : null}{" "}
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
