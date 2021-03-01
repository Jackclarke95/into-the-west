import React, { useState, useEffect } from "react";
import { firebaseDb } from "../firebase.utils";

const TestSessions = () => {
  var [objects, setObjects] = useState({});

  useEffect(() => {
    firebaseDb.child("sessions").on("value", (snapshot) => {
      if (snapshot.val() != null) {
        setObjects({ ...snapshot.val() });
      } else {
        setObjects({});
      }
    });
  }, []);

  const addRecord = (obj) => {
    firebaseDb.child("sessions").push(obj);
  };

  const updateRecord = (key, value) => {
    firebaseDb.child(`sessions/${key}`).update(value);
  };

  const deleteRecord = (id) => {
    if (window.confirm("Are you sure to delete this record?")) {
      firebaseDb.child(`sessions/${id}`).remove();
    }
  };

  const addTestSession = () => {
    const sessions = [
      {
        id: 43,
        name: "The Tomb of King Toten'ra",
        "suggested-by": "Benjywa",
        "dungeon-master": "Benjywa",
        characters: [34185467, 27850604, 26125998, 44600443],
        "discord-channel": "#session-5",
        "suggested-date": "2021 01 30",
        "scheduled-date": "2021 02 18",
      },
      {
        id: 42,
        name: "Eliot Corvine's Disappearance",
        "suggested-by": "JackClarke",
        "dungeon-master": "SunRester",
        characters: [34185467, 44023424, 39965081],
        "discord-channel": "#session-4",
        "suggested-date": "2021 01 30",
        "scheduled-date": "2021 02 24",
      },
      {
        id: 41,
        name: "Westeridge Tombs",
        "suggested-by": "Chaia01",
        "dungeon-master": "JackClarke",
        characters: [27850604, 26128406, 39965081, 44600443],
        "discord-channel": "#session-3",
        "scheduled-date": "2021 02 03",
      },
      {
        id: 40,
        name: "Mercury's Castle",
        "suggested-by": "SchemingPnda",
        "dungeon-master": "JackClarke",
        characters: [38009220, 26128406, 27850604, 32902489],
        "discord-channel": "#session-2",
        "scheduled-date": "2021 02 02",
      },
      {
        id: 39,
        name: "Highway to HELL",
        "suggested-by": "BlackRoseSarah89",
        "dungeon-master": "Benjywa",
        "suggested-date": "2020 12 20",
        "scheduled-date": "2021 01 27",
        characters: [
          35316039,
          27850604,
          26128406,
          26125998,
          33132303,
          39965081,
        ],
        "discord-channel": "#session-1",
      },
      {
        id: 38,
        name: "Hans' Band Adventure",
        "suggested-by": "Benjywa",
        "dungeon-master": "SchemingPnda",
        characters: [34185467, 35316039, 33132303, 26133759],
        "discord-channel": "#session-2",
        "scheduled-date": "2020 12 07",
      },
      {
        id: 37,
        name: "Revenge - Investigating the North West Druid Circle",
        "suggested-by": "Chaia01",
        "suggested-date": "2020 11 15",
        "scheduled-date": "2020 01 25",
        characters: [27850604, 26128406, 38009220, 35316039, 34130081],
        "max-players": 5,
        "dungeon-master": "JackClarke",
        "discord-channel": "#session-5",
      },
      {
        id: 36,
        name: "The Mystery of Zhinas",
        "dungeon-master": "JackClarke",
        "suggested-by": "SchemingPnda",
        "suggested-date": "2020 11 15",
        characters: [38009220, 27850604, 32902489, 26125998, 35316039],
        "max-players": 5,
        "discord-channel": "#session-4",
        "scheduled-date": "2020 11 30",
      },
      {
        id: 35,
        name: "Swamp Hunt - Eitr-Ormr (Hydra?)",
        "dungeon-master": "SchemingPnda",
        "suggested-by": "JackClarke",
        "suggested-date": "2020 11 06",
        "scheduled-date": "2020 11 23",
        characters: [38009220, 32902489, 27850604, 35316039, 33132303],
        "max-players": 5,
        "discord-channel": "#session-1",
      },
      {
        id: 34,
        name: "Babel's Tech Adventure",
        "dungeon-master": "JackClarke",
        "suggested-by": "SunRester",
        "scheduled-date": "2020 11 15",
        characters: [26128406, 27850604, 35316039, 35316039, 33132303],
        "max-players": 5,
        "discord-channel": "#session-2",
      },
      {
        id: 24,
        name: "WANTED: Iron Kara",
        "dungeon-master": "FreemDeem",
        "suggested-by": "Chaia01",
        "suggested-date": "2020 09 03",
        "scheduled-date": "2020 10 01",
        characters: [34044602, 27850604, 35316039, 30318222, 34130081],
        "max-players": 5,
        "discord-channel": "#session-2",
      },
      {
        id: 26,
        name: "Zhushah's Escort",
        "dungeon-master": "JackClarke",
        "suggested-by": "SunRester",
        "scheduled-date": "2020 10 22",
        characters: [26128406, 35316039, 27850604, 34130081, 26109480],
        "max-players": 5,
        "discord-channel": "#session-2",
      },
      {
        id: 27,
        name: "Genie Junquama the Magnificent",
        "dungeon-master": "SunRester",
        "suggested-by": "SunRester",
        "suggested-date": "2020 09 10",
        "scheduled-date": "2020 10 25",
        characters: [26119200, 34185467, 26133759, 34044602, 27850604],
        "max-players": 5,
        "discord-channel": "#session-1",
      },
      {
        id: 28,
        name: "Fuck It, Let's Fight This Beholder",
        "dungeon-master": "JackClarke",
        "suggested-by": "ThePerkyRiolu",
        "suggested-date": "2020 10 08",
        "scheduled-date": "2020 10 26",
        characters: [26109480, 30318222, 26119200, 33132303, 34044602],
        "max-players": 5,
        "discord-channel": "#session-3",
      },
      {
        id: 29,
        name: "THE HAUNT - Halloween Special",
        "dungeon-master": "Benjywa",
        "suggested-by": "Benjywa",
        "suggested-date": "2020 10 13",
        "scheduled-date": "2020 11 12",
        characters: [
          34189033,
          26133759,
          30038677,
          26128406,
          33132303,
          27850604,
        ],
        "max-players": 5,
        "discord-channel": "#session-4",
      },
      {
        id: 30,
        name: "Halloween Improv Adventure",
        "dungeon-master": "JackClarke",
        "suggested-by": "JackClarke",
        "suggested-date": "2020 10 15",
        "scheduled-date": "2020 11 02",
        players: [
          "JackClarke",
          "FreemDeem",
          "SchemingPnda",
          "SunRester",
          "ThePerkyRiolu",
        ],
        "max-players": 5,
        "discord-channel": "#session-2",
      },
      {
        id: 31,
        name: "Gotta Save the Babies!",
        "dungeon-master": "SchemingPnda",
        "suggested-by": "Chaia01",
        "suggested-date": "2020 10 27",
        "scheduled-date": "2020 11 04",
        characters: [27850604, 26128406, 35316039, 33132303, 27760478],
        "max-players": 5,
        "discord-channel": "#session-1",
      },
      {
        id: 33,
        name: "The Hamlin Horror",
        "dungeon-master": "FreemDeem",
        "suggested-by": "FreemDeem",
        "suggested-date": "2020 10 28",
        players: [
          "JackClarke",
          "ThePerkyRiolu",
          "SchemingPnda",
          "BlackRoseSarah89",
        ],
        "max-players": 5,
        "discord-channel": "#session-3",
      },
      {
        id: 32,
        name: "Help Chaia Clear Her Name!",
        "dungeon-master": "JackClarke",
        "suggested-by": "Chaia01",
        "suggested-date": "2020 10 28",
        "scheduled-date": "2020 11 12",
        characters: [27850604, 34130081, 35316039, 35382595, 27760478],
        "max-players": 5,
        "discord-channel": "#session-5",
      },
      {
        id: 25,
        name: "Grimshroom's Revenge",
        "dungeon-master": "JackClarke",
        "scheduled-date": "2020 10 07",
        characters: [26119200, 35382595, 26114444, 34189033, 26109480],
      },
      {
        id: 23,
        name: "Zak's Peak",
        "dungeon-master": "JackClarke",
        "scheduled-date": "2020 09 08",
        characters: [34044602, 26128406, 26119200, 27850604, 26109480],
      },
      {
        id: 22,
        name: "Jack Wareham 2",
        "dungeon-master": "SchemingPnda",
        "scheduled-date": "2020 09 02",
        characters: [26128406, 26119200, 3, 31690387, 26125998],
      },
      {
        id: 21,
        name: "Werewolves 2",
        "dungeon-master": "JackClarke",
        "scheduled-date": "2020 08 31",
        characters: [26119200, 33132303, 26125998, 30318222],
      },
      {
        id: 20,
        name: "Bright Eyes Bart",
        "dungeon-master": "FreemDeem",
        "scheduled-date": "2020 08 24",
        characters: [34044602, 3, 34185467, 34130081, 26109480, 26133759],
      },
      {
        id: 19,
        name: "Ruined Tower",
        "dungeon-master": "JackClarke",
        "scheduled-date": "2020 08 18",
        characters: [26128406, 27850604, 33132303, 31690387, 26109480],
      },
      {
        id: 18,
        name: "Fallen Star 2",
        "dungeon-master": "JackClarke",
        "scheduled-date": "2020 08 17",
        characters: [4, 30038677, 26119200, 31690387, 26133759],
      },
      {
        id: 17,
        name: "Jack Wareham",
        "dungeon-master": "SchemingPnda",
        "scheduled-date": "2020 08 13",
        characters: [4, 26119200, 3, 26109480],
      },
      {
        id: 16,
        name: "Ruined Castle",
        "dungeon-master": "JackClarke",
        "scheduled-date": "2020 08 04",
        characters: [26128406, 33132303, 30318222, 26109480],
      },
      {
        id: 15,
        name: "Delin's Contract",
        "dungeon-master": "JackClarke",
        "scheduled-date": "2020 07 28",
        characters: [26128406, 27850604, 31690387, 30318222, 26109480],
      },
      {
        id: 14,
        name: "Sawmill",
        "dungeon-master": "FreemDeem",
        "scheduled-date": "2020 07 22",
        characters: [31690387, 26125998, 26114444, 30318222, 26441175],
      },
      {
        id: 13,
        name: "Barbarian Camp",
        "dungeon-master": "FreemDeem",
        "scheduled-date": "2020 07 15",
        characters: [31690387, 26125998, 26114444, 26441175, 26109480],
      },
      {
        id: 1,
        name: "Abandoned Tower 1 - Gnolls",
        "dungeon-master": "JackClarke",
        "scheduled-date": "2020 04 09",
        characters: [26128406, 26119200, 26125998, 26441175, 2],
      },
      {
        id: 2,
        name: "Fallen Star",
        "dungeon-master": "JackClarke",
        "scheduled-date": "2020 04 11",
        characters: [26114444, 26133759, 26375809, 26521341, 26441175],
      },
      {
        id: 3,
        name: "Mountain Fortress 1 - Lord",
        "dungeon-master": "JackClarke",
        "scheduled-date": "2020 04 22",
        characters: [26128406, 26119200, 26133759, 26109480, 2],
      },
      {
        id: 4,
        name: "Village and Goblin Warband",
        "dungeon-master": "JackClarke",
        "scheduled-date": "2020 04 29",
        characters: [26119200, 26125998, 26114444, 26441175, 26109480],
      },
      {
        id: 5,
        name: "Haunted Lighthouse",
        "dungeon-master": "JackClarke",
        "scheduled-date": "2020 05 03",
        characters: [26128406, 27850604, 26133759, 26441175],
      },
      {
        id: 6,
        name: "Goblin Warband Ambush",
        "dungeon-master": "JackClarke",
        "scheduled-date": "2020 05 09",
        characters: [26128406, 26119200, 27850604, 26125998, 26133759],
      },
      {
        id: 7,
        name: "Cantrigan's Murder",
        "dungeon-master": "FreemDeem",
        "scheduled-date": "2020 05 16",
        characters: [27850604, 26133759, 26109480, 28412605, 26441175],
      },
      {
        id: 8,
        name: "Mountain Fortress 2 - Ogres",
        "dungeon-master": "JackClarke",
        "scheduled-date": "2020 05 31",
        characters: [26128406, 26119200, 26125998, 26441175, 2],
      },
      {
        id: 9,
        name: "Cantrigan's Gryphon",
        "dungeon-master": "FreemDeem",
        "scheduled-date": "2020 06 22",
        characters: [30038677, 27850604, 26125998, 26114444, 26109480],
      },
      {
        id: 10,
        name: "Swamp & Werewolves",
        "dungeon-master": "JackClarke",
        "scheduled-date": "2020 06 24",
        characters: [26128406, 30038677, 26119200, 27850604],
      },
      {
        id: 11,
        name: "Forest Tribe Village",
        "dungeon-master": "JackClarke",
        "scheduled-date": "2020 06 30",
        characters: [30038677, 26119200, 26125998, 30318222, 26109480],
      },
      {
        id: 12,
        name: "Abandoned Tower 2 - Sentry",
        "dungeon-master": "JackClarke",
        "scheduled-date": "2020 07 11",
        characters: [26128406, 26119200, 30318222, 26109480, 26441175],
      },
    ];

    var randomCharacter = sessions[Math.floor(Math.random() * sessions.length)];
    addRecord(randomCharacter);
  };

  return (
    <>
      <div>Sessions</div>
      <button onClick={() => addTestSession()}>Add Random Session</button>
      <table>
        <thead>
          <th>Title</th>
          <th>Dungeon Master</th>
          <th>Suggested Date</th>
          <th>Scheduled Date</th>
        </thead>
        <tbody>
          {Object.keys(objects).map((key) => {
            let currentRecord = objects[key];
            return (
              <tr key={key} data-id={currentRecord.id}>
                <td>{currentRecord.name}</td>
                <td>
                  {currentRecord["dungeon-master"]
                    ? currentRecord["dungeon-master"]
                    : "None yet"}
                </td>
                <td>
                  {currentRecord["suggested-date"]
                    ? currentRecord["suggested-date"]
                    : "N/A"}
                </td>
                <td>
                  {currentRecord["scheduled-date"]
                    ? currentRecord["scheduled-date"]
                    : "N/A"}
                </td>
                <td>
                  <button
                    onClick={() => {
                      currentRecord.name = "Test";
                      updateRecord(key, currentRecord);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      deleteRecord(key);
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

export default TestSessions;
