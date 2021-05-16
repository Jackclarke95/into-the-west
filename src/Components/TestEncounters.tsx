import React, { useState, useEffect } from "react";
import { firebaseDb } from "../firebase.utils";

const TestEncounters = () => {
  var [encounters, setEncounters] = useState({});
  var [currentId, setCurrentId] = useState("");
  var [currentObject, setCurrentObject] = useState({});

  useEffect(() => {
    firebaseDb.child("encounters").on("value", (snapshot) => {
      if (snapshot.val() != null) {
        setEncounters({ ...snapshot.val() });
      } else {
        setEncounters({});
      }
    });
  }, []);

  const addRecord = (obj) => {
    firebaseDb.child("encounters").push(obj);
  };

  const addTestEncounter = () => {
    const encounters = [
      { arctic: [{ test: "encounter 1" }, { name: "encounter 2" }] },
      { coastal: [{ test: "encounter 1" }, { name: "encounter 2" }] },
      { desert: [{ test: "encounter 1" }, { name: "encounter 2" }] },
      { forest: [{ test: "encounter 1" }, { name: "encounter 2" }] },
      { grassland: [{ test: "encounter 1" }, { name: "encounter 2" }] },
      { hill: [{ test: "encounter 1" }, { name: "encounter 2" }] },
      { mountain: [{ test: "encounter 1" }, { name: "encounter 2" }] },
      { swamp: [{ test: "encounter 1" }, { name: "encounter 2" }] },
      { underdark: [{ test: "encounter 1" }, { name: "encounter 2" }] },
      { urban: [{ test: "encounter 1" }, { name: "encounter 2" }] },
    ];

    var randomEncounter =
      encounters[Math.floor(Math.random() * encounters.length)];
    addRecord(randomEncounter);
  };

  return (
    <>
      <h2>Encounters</h2>
      <button onClick={() => addTestEncounter()}>Add Random Encounter</button>
      <table
        style={{
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <th>Title</th>
          <th>Dungeon Master</th>
          <th>Suggested Date</th>
          <th>Scheduled Date</th>
        </thead>
        <tbody>
          {Object.keys(encounters).map((key, i) => {
            let encounter = encounters[key];
            return (
              <tr
                style={{
                  backgroundColor: i % 2 !== 0 ? "lightgrey" : "white",
                }}
                key={key}
                data-id={encounter.id}
              >
                <td>{encounter.name}</td>
                <td>
                  {encounter["dungeon-master"]
                    ? encounter["dungeon-master"]
                    : "None yet"}
                </td>
                <td>
                  {encounter["suggested-date"]
                    ? encounter["suggested-date"]
                    : "N/A"}
                </td>
                <td>
                  {encounter["scheduled-date"]
                    ? encounter["scheduled-date"]
                    : "N/A"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default TestEncounters;
