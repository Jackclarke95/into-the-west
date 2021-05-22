import { useState, useEffect } from "react";
import { MdModeEdit, MdSave, MdFileUpload } from "react-icons/md";
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
  const [newImage, setNewImage] = useState([] as any[]);
  const [characterName, setCharacterName] = useState(character.name as string);
  const [characterNickName, setCharacterNickName] = useState(
    character.nickname ?? (null as string | null)
  );

  const submitForm = () => {
    if (
      characterName.includes(" ") &&
      (characterNickName === "" || !characterNickName)
    ) {
      return;
    } else {
      updateCharacter();
      setEdit(!edit);
    }
  };

  const updateCharacter = () => {
    character.name = characterName.trim();
    character.nickname = characterName.includes(" ")
      ? characterNickName.trim()
      : null;
    firebaseDb.child(`characters/${characterKey}`).update(character);
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

  let playerMatch =
    player && player["dndbeyond-name"] === character["player-dndbeyond-name"];

  const levelMatch = getFormattedTotalLevel() !== getFormattedCorrectLevel();

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
          style={{ marginLeft: "1em", flexGrow: 1 }}
        >
          {edit ? (
            <div>
              <input
                type="text"
                placeholder="Full Name"
                value={characterName}
                onChange={(e) => setCharacterName(e.target.value)}
                onBlur={(e) => setCharacterName(e.target.value.trim())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    submitForm();
                  }
                }}
                className="input-character-name"
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              />
              <input
                type="text"
                placeholder="Nickname"
                disabled={!characterName.includes(" ")}
                value={characterNickName ?? null}
                onChange={(e) => setCharacterNickName(e.target.value)}
                onBlur={(e) => setCharacterNickName(e.target.value.trim())}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    submitForm();
                  }
                }}
                className="input-character-name-nickname"
                style={{
                  fontSize: "16px",
                  fontWeight: "bold",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: !characterName.includes(" ") ? "none" : "block",
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
                >
                  Please provide a nickname/display name
                </div>
              ) : null}
            </div>
          ) : (
            <>
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
              <div
                style={{ display: "flex" }}
                className="character-card-data-body"
              >
                <div style={{ flexGrow: 1 }} className="character-details">
                  <div
                    className="character-summary"
                    style={{ display: "flex", fontWeight: 500 }}
                  >
                    <div
                      title={
                        levelMatch ? "Missing level data (speak to Jack)" : ""
                      }
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
                    Session Count:{" "}
                    {deteremineSessionsAttended(character, sessions)}
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
            </>
          )}
        </span>
        {playerMatch ? (
          !edit ? (
            <button
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
                height: "3em",
                backgroundColor: "grey",
                border: "none",
                width: "3em",
              }}
            >
              <MdModeEdit
                size="1.5em"
                onClick={() => setEdit(!edit)}
                title="Edit"
                style={{ cursor: "pointer" }}
              />
            </button>
          ) : (
            <button
              disabled={
                (characterName.includes(" ") &&
                  (characterNickName === "" || !characterNickName)) ||
                (characterNickName && characterNickName.includes(" "))
              }
              onClick={submitForm}
              style={{
                color: "white",
                display: "flex",
                cursor: "pointer",
                alignItems: "center",
                justifyContent: "center",
                height: "3em",
                backgroundColor: "green",
                border: "none",
                width: "3em",
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
    </div>
  ) : (
    <div>Loading</div>
  );
};

export default CharacterCard;
