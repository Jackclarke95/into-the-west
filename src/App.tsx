import React, { useState, useEffect } from "react";
import TestCharacters from "./Components/TestCharacters";
import Character from "./Components/Character";
import TestSessions from "./Components/TestSessions";
import TestEncounters from "./Components/TestEncounters";
import TestImages from "./Components/TestImages";
import firebase, { firebaseDb, firestore } from "./firebase.utils";
import "./App.css";

function App() {
  const [characters, setCharacters] = useState({});
  const [sessions, setSessions] = useState({});

  useEffect(() => {
    firebaseDb.child("sessions").on("value", (snapshot) => {
      if (snapshot.val() != null) {
        setSessions({ ...snapshot.val() });
      } else {
        setSessions({});
      }
    });

    firebaseDb
      .child("characters")
      .orderByChild("starting-level")
      .on("value", (snapshot) => {
        if (snapshot.val() != null) {
          setCharacters({ ...snapshot.val() });
        } else {
          setCharacters({});
        }
      });
  }, []);

  return (
    <div>
      <h1>Into The West</h1>
      <Character
        character={{
          "avatar-link": "11867/502/1581111423-32902489.jpeg",
          classes: [
            {
              class: "Cleric",
              level: 2,
            },
            {
              class: "Artificer",
              level: 7,
            },
          ],
          id: 32902489,
          name: "Caduceus",
          nickname: "C.A.D.",
          "player-dndbeyond-name": "ThePerkyRiolu",
          race: "???",
          "starting-level": 9,
        }}
      />
      <TestCharacters characters={characters} sessions={sessions} />
      <TestSessions characters={characters} sessions={sessions} />
      <TestEncounters />
      <TestImages name="Eslyn.jpeg" />
    </div>
  );
}

export default App;
