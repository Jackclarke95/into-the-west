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

  const getRandomEncounter = () => {
    let recordCount;
    let array = [] as any;

    firebaseDb.child("encounters").once("value", (snapshot) => {
      snapshot.forEach((item) => {
        recordCount = snapshot.numChildren();
        array.push(item.val());
      });
    });

    const randomIndex = Math.floor(Math.random() * recordCount);
    const encounter = array[randomIndex];

    return encounter;
  };

  return (
    <>
      <h2>Encounters</h2>
      <button onClick={() => setCurrentEncounter(getRandomEncounter())}>
        Generate Random Encounter
      </button>

      {currentEncounter.discovery || currentEncounter.enemies ? (
        <>
          <h3>Random Encounter:</h3>
          <div>{`Terrain: ${currentEncounter.terrain}`}</div>
          <div>
            {`${currentEncounter.discovery ?? ""} ${currentEncounter.enemies
              ?.map((enemy) => {
                var enemyList = [] as string[];

                if (isNaN(enemy.quantity)) {
                  var count = 0;

                  // Roll the dice
                  for (var i = 0; i < enemy.quantity["die-count"]; i++) {
                    count += Math.ceil(Math.random() * enemy.quantity.die);
                  }

                  count += enemy.quantity.modifier ?? 0;
                  enemyList.push(`${count} ${enemy.type}s`);
                } else {
                  enemyList.push(`a ${enemy.type}`);
                }

                return enemyList;
              })
              .join(", ")}`}
          </div>
        </>
      ) : null}
    </>
  );
};

export default TestEncounters;
