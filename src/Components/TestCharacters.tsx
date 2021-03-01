import React, { useState, useEffect } from "react";
import { firebaseDb } from "../firebase.utils";

const TestCharacters = () => {
  var [currentId, setCurrentId] = useState("");
  var [objects, setObjects] = useState({});

  useEffect(() => {
    firebaseDb.child("characters").on("value", (snapshot) => {
      if (snapshot.val() != null) {
        setObjects({ ...snapshot.val() });
      } else {
        setObjects({});
      }
    });
  }, []);

  const add = (obj) => {
    firebaseDb.child("characters").push(obj);
    setCurrentId("");
  };

  const update = (key, value) => {
    firebaseDb.child(`characters/${key}`).update(value);
    setCurrentId("");
  };

  const onDelete = (id) => {
    if (window.confirm("Are you sure to delete this record?")) {
      firebaseDb.child(`characters/${id}`).remove();
    }
  };

  const addTestObject = () => {
    const characters = [
      {
        id: 38950925,
        "player-dndbeyond-name": "Jonno0902",
        "avatar-link": "17/733/636378312343935370.jpeg",
        name: "Relthine",
        race: "Aarakocra",
        classes: [{ class: "Monk", level: 6 }],
        "starting-level": 6,
      },
      {
        id: 32902489,
        "player-dndbeyond-name": "ThePerkyRiolu",
        "avatar-link": "11867/502/1581111423-32902489.jpeg",
        name: "Caduceus",
        nickname: "C.A.D.",
        race: "???",
        classes: [
          { class: "Cleric", level: 2 },
          { class: "Artificer", level: 7 },
        ],
        "starting-level": 9,
      },
      {
        id: 34044602,
        "player-dndbeyond-name": "Proxysaurus",
        "avatar-link": "12923/282/1581111423-34044602.jpeg",
        name: "Arthur Scone-Fopley",
        nickname: "Arthur",
        race: "Human",
        classes: [
          { class: "Fighter", level: 5 },
          { class: "Barbarian", level: 1 },
        ],
        "starting-level": 6,
      },
      {
        id: 39965081,
        "player-dndbeyond-name": "SchemingPnda",
        "avatar-link": "14805/256/1581111423-39965081.jpeg",
        name: "Frodi",
        race: "Dragonborn",
        classes: [{ class: "Fighter", level: 7 }],
        "starting-level": 7,
      },
      {
        id: 26128406,
        "player-dndbeyond-name": "SunRester",
        "avatar-link": "9608/256/637216255844292177.jpeg",
        name: "Babel",
        race: "Kenku",
        classes: [{ class: "Artificer", level: 9 }],
        "starting-level": 3,
      },
      {
        id: 30038677,
        "player-dndbeyond-name": "AnAxeCalledYorik",
        "avatar-link": "9107/446/637196227255761865.jpeg",
        name: "Toussaint Baptiste Lafayette",
        nickname: "Baptiste",
        race: "Elf",
        subrace: "High",
        classes: [{ class: "Rogue", level: 5 }],
        "starting-level": 3,
      },
      {
        id: 26119200,
        "player-dndbeyond-name": "FreemDeem",
        "avatar-link": "17/428/636377886920052559.jpeg",
        name: "Big Percy",
        race: "Half-orc",
        classes: [{ class: "Fighter", level: 8 }],
        "starting-level": 3,
        retirement: {
          date: "2020 10 26",
          cause: "Last seen in beholder's lair, presumed perished",
          dead: true,
        },
      },
      {
        id: 27850604,
        "player-dndbeyond-name": "Chaia01",
        "avatar-link": "10265/600/637240973238597441.png",
        name: "Chaia Millicent Winterstorm",
        nickname: "Chaia",
        race: "Elf",
        subrace: "Wood",
        classes: [{ class: "Druid", level: 6 }],
        "starting-level": 3,
      },
      {
        id: 34185467,
        "player-dndbeyond-name": "JackClarke",
        "avatar-link": "12289/752/1581111423-34185467.jpeg",
        name: "Eslyn Juhlenath",
        nickname: "Eslyn",
        race: "Triton",
        classes: [{ class: "Sorcerer", level: 6 }],
        "starting-level": 6,
      },
      {
        id: 34189033,
        "player-dndbeyond-name": "Proxysaurus",
        "avatar-link": "13124/972/1581111423-34189033.jpeg",
        name: "Inquisitor Lynchmire",
        nickname: "Lynchmire",
        race: "Half-elf",
        subrace: "Drow",
        classes: [{ class: "Warlock", level: 6 }],
        "starting-level": 6,
      },
      {
        id: 33132303,
        "player-dndbeyond-name": "BlackRoseSarah89",
        "avatar-link": "11957/368/1581111423-33132303.jpeg",
        name: "Ember",
        race: "Genasi",
        subrace: "Fire",
        classes: [{ class: "Cleric", level: 5 }],
        "starting-level": 5,
      },
      {
        id: 35382595,
        "player-dndbeyond-name": "SchemingPnda",
        "avatar-link": "12649/693/1581111423-35382595.jpeg",
        name: "Grimshroom",
        race: "Goblin",
        classes: [{ class: "Druid", level: 6 }],
        "starting-level": 6,
        retirement: {
          date: "2021 01 01",
          cause: "Retired by player",
        },
      },
      {
        id: 26375809,
        "player-dndbeyond-name": "Brewhan",
        "avatar-link": "18/19/636378975313015155.jpeg",
        name: "Raahm Bru'Han",
        nickname: "Raahm",
        race: "Human",
        classes: [{ class: "Barbarian", level: 3 }],
        "starting-level": 3,
      },
      {
        id: 35316039,
        "player-dndbeyond-name": "Benjywa",
        "avatar-link": "12923/301/1581111423-35316039.jpeg",
        name: "Hans Eleganza",
        nickname: "Hans",
        race: "Halfling",
        subrace: "Lightfoot",
        classes: [
          { class: "Bard", level: 5 },
          { class: "Warlock", level: 1 },
        ],
        "starting-level": 6,
      },
      {
        id: 44023424,
        "player-dndbeyond-name": "Benjywa",
        name: "Samedi",
        race: "Kalashtar",
        classes: [
          { class: "Bard", level: 7 },
          { class: "Warlock", level: 2 },
        ],
        "starting-level": 9,
      },
      {
        id: 26125998,
        "player-dndbeyond-name": "TheKingsmantm",
        "avatar-link": "9616/486/637216416498708507.jpeg",
        name: "Lorenz",
        race: "Tiefling",
        classes: [{ class: "Sorcerer", level: 6 }],
        "starting-level": 3,
      },
      {
        id: 26114444,
        "player-dndbeyond-name": "Jonno0902",
        "avatar-link": "9765/125/1581111423-26114444.jpeg",
        name: "Luren",
        race: "Tiefling",
        classes: [{ class: "Warlock", level: 5 }],
        "starting-level": 3,
        retirement: { date: "2020 10 26", cause: "Killed by a beholder" },
      },
      {
        id: 27760478,
        "player-dndbeyond-name": "FreemDeem",
        "avatar-link": "17/445/636377888642793044.jpeg",
        name: "Patches O'Toole",
        nickname: "Patches",
        race: "Halfling",
        subrace: "Lightfoot",
        classes: [{ class: "Rogue", level: 8 }],
        "starting-level": 8,
      },
      {
        id: 26109480,
        "player-dndbeyond-name": "ThePerkyRiolu",
        "avatar-link": "18/18/636378975214214687.jpeg",
        name: "Zaukan Thulaga Hornbearer",
        nickname: "Zak",
        race: "Goliath",
        classes: [{ class: "Paladin", level: 8 }],
        "starting-level": 3,
      },
      {
        id: 30318222,
        "player-dndbeyond-name": "SchemingPnda",
        "avatar-link": "11048/16/1581111423-30318222.jpeg",
        name: "Pipit",
        race: "Half-elf",
        subrace: "Wood",
        classes: [
          { class: "Ranger", level: 4 },
          { class: "Rogue", level: 2 },
        ],
        "starting-level": 4,
        retirement: {
          date: "2020 10 26",
          cause: "Last seen in beholder's lair, presumed perished",
        },
      },
      {
        id: 38009220,
        "player-dndbeyond-name": "SchemingPnda",
        "avatar-link": "17/924/636378852753221520.jpeg",
        name: "Mercury",
        race: "Tabaxi",
        classes: [{ class: "Monk", level: 6 }],
        "starting-level": 6,
      },
      {
        id: 31690387,
        "player-dndbeyond-name": "Kosky101",
        "avatar-link": "11688/396/1581111423-31690387.jpeg",
        name: "Harold Stormberg",
        nickname: "Stormberg",
        race: "Human",
        classes: [
          { class: "Fighter", level: 5 },
          { class: "Ranger", level: 1 },
        ],
        "starting-level": 4,
      },
      {
        id: 26133759,
        "player-dndbeyond-name": "Georgeousness",
        "avatar-link": "9765/428/1581111423-26133759.jpeg",
        name: "Qiharice",
        race: "Halfling",
        subrace: "Lightfoot",
        classes: [{ class: "Bard", level: 6 }],
        "starting-level": 3,
      },
      {
        id: 26521341,
        "player-dndbeyond-name": "Crabbi",
        "avatar-link": "9765/133/1581111423-26521341.jpeg",
        name: "Thurdun Kragbrew",
        nickname: "Thurdun",
        race: "Dwarf",
        classes: [{ class: "Bard", level: 3 }],
        "starting-level": 3,
      },
      {
        id: 34130081,
        "player-dndbeyond-name": "user-101304394",
        "avatar-link": "12250/463/1581111423-34130081.jpeg",
        name: "Utredyn Gurvusath",
        nickname: "Utredyn",
        race: "Triton",
        classes: [{ class: "Barbarian", level: 6 }],
        "starting-level": 5,
      },
      {
        id: 44600443,
        "player-dndbeyond-name": "HonestFee",
        "avatar-link": "15810/10/1581111423-44600443.jpeg",
        name: 'Sir "Digby" Napharat',
        nickname: "Digby",
        race: "Bugbear",
        classes: [{ class: "Fighter", level: 7 }],
        "starting-level": 7,
      },
      {
        id: 28412605,
        "player-dndbeyond-name": "JackClarke",
        "avatar-link": "10423/229/1581111423-28412605.jpeg",
        name: "Alavara Liarys",
        nickname: "Alavara",
        race: "Half-elf",
        subrace: "Wood",
        classes: [{ class: "Paladin", level: 4 }],
        "starting-level": 4,
        retirement: { date: "2020 05 17", cause: "Retired by player" },
      },
      {
        id: 26441175,
        "player-dndbeyond-name": "Proxysaurus",
        "avatar-link": "17/198/636377838389204588.jpeg",
        name: "Trazyn",
        race: "Human",
        classes: [{ class: "Wizard", level: 6 }],
        "starting-level": 3,
        retirement: { date: "2020 07 23", cause: "Retired by player" },
      },
      {
        id: 2,
        "player-dndbeyond-name": "SchemingPnda",
        name: "Wilhelm",
        race: "Mountain Dwarf",
        classes: [{ class: "Barbarian", level: 4 }],
        "starting-level": 3,
        retirement: { date: "2020 05 31", cause: "Killed by ogres" },
      },
      {
        id: 3,
        "player-dndbeyond-name": "Benjywa",
        name: "Galain",
        race: "Gnome",
        classes: [{ class: "Artificer", level: 6 }],
        "starting-level": 6,
        retirement: { date: "2020 08 03", cause: "Retired by player" },
      },
      {
        id: 4,
        "player-dndbeyond-name": "Proxysaurus",
        name: "Aatos",
        race: "Human",
        classes: [{ class: "Paladin", level: 6 }],
        "starting-level": 6,
        retirement: {
          date: "2020 08 17",
          cause: "Sacrificed self to a blue dragon to save party",
        },
      },
    ];

    var randomCharacter =
      characters[Math.floor(Math.random() * characters.length)];

    add(randomCharacter);
  };

  return (
    <>
      <div>Characters</div>
      <button onClick={() => addTestObject()}>Add Random Character</button>
      <table>
        <thead>
          <th>Character</th>
          <th>Race</th>
          <th>Starting Level</th>
        </thead>
        <tbody>
          {Object.keys(objects).map((key) => {
            let currentRecord = objects[key];
            return (
              <tr key={key} data-id={currentRecord.id}>
                <td className="column name">
                  <a
                    className="avatar-link"
                    rel="noopener noreferrer"
                    target="_blank"
                    href={`https://www.dndbeyond.com/avatars/${currentRecord["avatar-link"]}`}
                  >
                    <img
                      src={`https://www.dndbeyond.com/avatars/${currentRecord["avatar-link"]}`}
                      style={{
                        objectFit: "cover",
                        width: "30px",
                        height: "30px",
                      }}
                    />
                  </a>
                  <a
                    className="character-name"
                    rel="noopener noreferrer"
                    target="_blank"
                    href={`https://www.dndbeyond.com/profile/${currentRecord["player-dndbeyond-name"]}/characters/${currentRecord.id}`}
                  >
                    {currentRecord.nickname
                      ? currentRecord.nickname
                      : currentRecord.name}
                  </a>
                </td>
                <td>{currentRecord.race}</td>
                <td>{currentRecord["starting-level"]}</td>
                <td>
                  <button
                    onClick={() => {
                      currentRecord["starting-level"] = 69;
                      update(key, currentRecord);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      onDelete(key);
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default TestCharacters;
