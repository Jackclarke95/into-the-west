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

  let characterArray = [] as any[];

  Object.keys(characters).map((key) => {
    characterArray.push(characters[key]);
  });

  characterArray.sort((a, b) => {
    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
  });

  console.log(characterArray.length);

  return (
    <div>
      <h1>Into The West</h1>
      <div className="character-cards">
        {characterArray.map((character) => (
          <Character character={character} sessions={sessions} />
        ))}
      </div>
      <TestCharacters characters={characterArray} sessions={sessions} />
      <TestSessions characters={characters} sessions={sessions} />
      <TestEncounters />
      <TestImages name="Eslyn Juhlenath.jpeg" />
    </div>
  );
}

export default App;
