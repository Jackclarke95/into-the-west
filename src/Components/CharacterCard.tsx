import { useState, useEffect } from "react";
import {
  MdAdd,
  MdArrowUpward,
  MdModeEdit,
  MdSave,
  MdFileUpload,
  MdFlag,
} from "react-icons/md";
import { firestore, firebaseDb } from "../firebase.utils";
import {
  deteremineSessionsAttended,
  calculateSessionsForLevelUp,
  calculateLevelFromSessions,
  countSessionsAttended,
  getOrdinal,
  getMainClass,
  getMainClassColour,
  getCharacterClasses,
} from "../Helpers/DataHelper";

const CharacterCard = ({
  character,
  characterKey,
  sessions,
  player,
  currentPlayer = null as null | any,
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [edit, setEdit] = useState(false);
  const [retire, setRetire] = useState(false);
  const [levelUp, setLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState("");
  const [characterName, setCharacterName] = useState(character.name as string);
  const [characterNickName, setCharacterNickName] = useState(
    character.nickname ?? (null as string | null)
  );
  const [retirementReason, setRetirementReason] = useState("");

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
          `Unable to update Character. Verify that you are connected to the internet. Please try again.\n\nDetails:\n${e}`
        )
      );
  };

  const updateCharacterName = () => {
    character.name = characterName.trim();
    character.nickname = characterName.includes(" ")
      ? characterNickName.trim()
      : null;
    firebaseDb
      .child(`characters/${characterKey}`)
      .update(character)
      .then(() => window.location.reload())
      .catch((e) =>
        alert(
          `Failed to update Character. Verify that you are connected to the internet. Please try again.\n\nDetails:\n${e}`
        )
      );
  };

  const retireCharacter = () => {
    if (retirementReason.length === 0) {
      return;
    }

    const now = new Date();

    const dateString = `${now.getFullYear()} ${
      now.getMonth() + 1
    } ${now.getDate()}`;

    character.retirement = { cause: retirementReason, date: dateString };

    if (
      window.confirm(
        `Are you sure you want to retire ${character.name}? This action cannot be undone.`
      )
    ) {
      firebaseDb
        .child(`characters/${characterKey}`)
        .update(character)
        .then(() => window.location.reload())
        .catch((e) =>
          alert(
            `Failed to update Character. Verify that you are connected to the internet. Please try again.\n\nDetails:\n${e}`
          )
        );
    } else {
      window.location.reload();
    }
  };

  const claimCharacter = () => {
    if (
      window.confirm(
        `Please ensure that ${character.name} belongs to you before proceeding.`
      )
    ) {
      character["player-dndbeyond-name"] = currentPlayer["dndbeyond-name"];

      firebaseDb
        .child(`characters/${characterKey}`)
        .update(character)
        .catch((e) =>
          alert(
            `Failed to claim Character. Verify that you are connected to the internet. Please try again.\n\nDetails:\n${e}`
          )
        );

      window.location.reload();
    }
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

  const getLevelFromClasses = () => {
    let totalLevel = 0;

    character.classes.forEach((characterClass) => {
      totalLevel += characterClass.level;
    });

    return totalLevel;
  };

  const getLevelFromSessions = () => {
    return calculateLevelFromSessions(
      character["starting-level"],
      countSessionsAttended(character, sessions)
    );
  };

  const getFormattedLevelFromClasses = () => {
    return `${getOrdinal(getLevelFromClasses())} Level`;
  };

  const getFormatedLevelFromSessions = () => {
    return `${getOrdinal(getLevelFromSessions())} Level`;
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

    if (file.size > 2 * 1024 * 1024) {
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
            `Failed to upload image. Verify that you are connected to the internet. Please try again.\n\nDetails:\n${e}`
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

  let playerMatch =
    currentPlayer &&
    currentPlayer["dndbeyond-name"] === character["player-dndbeyond-name"];

  const levelMatch =
    getFormattedLevelFromClasses() >= getFormatedLevelFromSessions();
  const characterClasses = getCharacterClasses(character);
  const characterClaimed = character["player-dndbeyond-name"] ? true : false;
  const retired = character.retirement ? true : false;
  const characterColour = character.retirement
    ? "grey"
    : getMainClassColour(character);

  return character ? (
    <div
      className="character-card"
      data-character-name={character.name}
      title={getDisplayName()}
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
            borderRadius: "50%",
          }}
        >
          <img
            alt={`${character.name} Avatar`}
            className="character-image"
            style={{
              height: 100,
              width: 100,
              objectFit: "cover",
              borderRadius: "50%",
              filter: character.retirement ? "grayscale(100%)" : "none",
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
        <div
          className="character-card-data"
          style={{ marginLeft: "0.5em", flexGrow: 1 }}
        >
          <div
            className="character-card-data-title"
            style={{
              display: "flex",
              borderBottomStyle: "solid",
              borderBottomWidth: 3,
              borderBottomColor: characterColour,
              paddingBottom: "1px",
              marginBottom: "1px",
            }}
          >
            {edit ? (
              <div
                className="input-character-names"
                style={{ display: "flex", flexGrow: 1 }}
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
                    width: "50%",
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
                    width: "50%",
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
                        title={`${characterClass}`}
                        className="character-class"
                        style={{
                          height: 25,
                          width: 25,
                          objectFit: "cover",
                          marginRight: "0.5em",
                          borderRadius: "50%",
                          filter: character.retirement
                            ? "grayscale(100%)"
                            : "none",
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
                    width: "100%",
                  }}
                >
                  {getDisplayName()}
                </div>
              </>
            )}
            {!character.retirement && playerMatch ? (
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
                    color={characterColour}
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
                  onClick={() => {
                    setRetire(false);
                    saveNewName();
                  }}
                  style={{
                    cursor: "pointer",
                    border: "none",
                    background: "none",
                  }}
                >
                  <MdSave
                    size="1.5em"
                    style={{ alignSelf: "center" }}
                    color={characterColour}
                  />
                </button>
              )
            ) : currentPlayer && !characterClaimed ? (
              <MdFlag
                size="1.5em"
                style={{ alignSelf: "center", cursor: "pointer" }}
                color={characterColour}
                onClick={claimCharacter}
                title="Claim this Character"
              />
            ) : null}
          </div>
          <div style={{ display: "flex" }} className="character-card-data-body">
            <div style={{ flexGrow: 1 }} className="character-details">
              {!levelUp ? (
                <div
                  className="character-summary-container"
                  style={{
                    display: "flex",
                    height: "1.3em",
                    flexGrow: 1,
                  }}
                >
                  {!retire ? (
                    <div
                      className="character-summary"
                      style={{ fontWeight: 500, flexGrow: 1 }}
                    >
                      {getFormattedLevelFromClasses()} | {getRace()} |{" "}
                      {getFormattedClasses()}
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder="Retirement Reason"
                      value={retirementReason ?? null}
                      onChange={(e) => setRetirementReason(e.target.value)}
                      onBlur={(e) => setRetirementReason(e.target.value.trim())}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          retireCharacter();
                        }
                      }}
                      className="input-retirement-reason"
                      style={{
                        width: "100%",
                        borderColor:
                          retirementReason.length === 0 ? "red" : undefined,
                      }}
                    />
                  )}
                  {edit ? (
                    <button
                      className="save-button"
                      title="Save Name"
                      disabled={retirementReason.length === 0}
                      onClick={() => {
                        setRetire(!retire);
                        retireCharacter();
                      }}
                      style={{
                        cursor: "pointer",
                        border: "none",
                        background: "none",
                      }}
                    >
                      {!retire ? (
                        <MdAdd
                          color={characterColour}
                          size="2em"
                          title="Retire Character"
                          onClick={() => {
                            setRetire(!retire);
                          }}
                          style={{
                            cursor: "pointer",
                            transform: "rotate(45deg)",
                            marginRight: "-5px",
                            marginTop: "-2px",
                          }}
                        />
                      ) : (
                        <MdSave
                          color={characterColour}
                          size="1.5em"
                          title="Retire Character"
                          style={{ cursor: "pointer" }}
                        />
                      )}
                    </button>
                  ) : null}
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
              {retired ? (
                <div
                  className="character-retirement"
                  style={{
                    maxHeight: "2.9em",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {character.retirement.cause}
                </div>
              ) : (
                <>
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
                      <div
                        style={{ marginRight: "0.3em", marginLeft: "0.3em" }}
                      >
                        |
                      </div>
                    ) : null}
                    {player.discord ? (
                      <div>
                        <b>Discord: </b>
                        {player.discord}
                      </div>
                    ) : null}
                  </div>
                </>
              )}
            </div>
            {playerMatch && !levelMatch && !retired ? (
              !edit ? (
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
              ) : null
            ) : null}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div>Loading</div>
  );
};

export default CharacterCard;
