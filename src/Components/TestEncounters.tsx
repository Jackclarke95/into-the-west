import React, { useState, useEffect } from "react";
import { firebaseDb } from "../firebase.utils";

const TestEncounters = () => {
  var [encounters, setEncounters] = useState({});
  var [currentEncounter, setCurrentEncounter] = useState({} as any);

  useEffect(() => {
    firebaseDb.child("encounters").on("value", (snapshot) => {
      if (snapshot.val() != null) {
        setEncounters({ ...snapshot.val() });
      } else {
        setEncounters({});
      }
    });
  }, []);

  const addEncounter = (encounter) => {
    firebaseDb.child("encounters").push(encounter);
  };

  const addTestEncounter = () => {
    const encounters = [
      { terrain: "arctic", enemies: [{ type: "giant owl", quantity: 1 }] },
      {
        terrain: "arctic",
        discovery:
          "A partially eaten carcass of a mammoth, from which 1d4 rations can be harvested",
      },
      {
        terrain: "arctic",
        enemies: [
          {
            type: "kobold",
            quantity: { die: 6, "die-count": 1, modifier: 3 },
          },
        ],
      },
      {
        terrain: "arctic",
        enemies: [
          {
            type: "bandit",
            quantity: { die: 6, "die-count": 2 },
          },
          { type: "bandit captain", quantity: 1 },
        ],
      },
    ];

    var randomEncounter =
      encounters[Math.floor(Math.random() * encounters.length)];
    randomEncounter.enemies?.map((monster) => {});

    addEncounter(randomEncounter);
  };

  const getRandomEncounter = () => {
    let recordCount;

    // firebaseDb.child("encounters").once("value", (snapshot) => {
    //   recordCount = snapshot.numChildren();
    // });

    let array = [] as any;

    firebaseDb.child("encounters").once("value", (snapshot) => {
      snapshot.forEach((item) => {
        recordCount = snapshot.numChildren();
        array.push(item.val());
      });
    });

    const randomIndex = Math.floor(Math.random() * recordCount);

    const encounter = array[randomIndex];

    console.log(encounter);

    setCurrentEncounter(encounter);

    return encounter;
  };

  return (
    <>
      <h2>Encounters</h2>
      <button onClick={() => addTestEncounter()}>Add Random Encounter</button>
      <button onClick={() => getRandomEncounter()}>Log Random Encounter</button>
      <table
        style={{
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <th>Terrain</th>
          <th>Encounter</th>
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
                <td>{encounter.terrain}</td>
                <td>
                  {encounter.discovery
                    ? encounter.discovery
                    : encounter.enemies.map((enemy) => {
                        return enemy.type;
                      })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div>{`Terrain: ${currentEncounter}`}</div>
      {/* <div>{`Terrain: ${currentEncounter}`}</div> */}
    </>
  );
};

export default TestEncounters;
