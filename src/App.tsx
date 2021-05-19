import React, { useState, useEffect } from "react";
import TestCharacters from "./Components/TestCharacters";
import Character from "./Components/Character";
import TestSessions from "./Components/TestSessions";
import TestEncounters from "./Components/TestEncounters";
import TestImages from "./Components/TestImages";
import firebase, {
  auth,
  firebaseDb,
  firestore,
  signInWithGoogle,
} from "./firebase.utils";
import "./App.scss";

function App() {
  const [characters, setCharacters] = useState({});
  const [sessions, setSessions] = useState({});
  const [user, setUser] = useState({} as any);
  const [currentPlayer, setCurrentPlayer] = useState();

  auth.onAuthStateChanged((user) => {
    console.log("setting user to:", user?.displayName, user?.uid);
    setUser(user);
  });

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

  if (user && user.uid && !currentPlayer) {
    console.log("Finding player");
    firebaseDb
      .child("players")
      .orderByChild("uid")
      .equalTo(user.uid)
      .on("value", (snapshot) => {
        if (snapshot.val() != null) {
          console.log("Snapshot value:", snapshot.val());
          setCurrentPlayer({ ...snapshot.val() });
        }
      });
  }

  let characterArray = [] as any[];

  Object.keys(characters).map((key) => {
    characterArray.push(characters[key]);
  });

  characterArray.sort((a, b) => {
    return a.name < b.name ? -1 : a.name > b.name ? 1 : 0;
  });

  return (
    <div>
      <button onClick={signInWithGoogle}>Sign In with Google</button>
      <button onClick={() => auth.signOut()}>Sign Out</button>
      <h1>Into The West</h1>
      <div className="characters" style={{ textAlign: "center" }}>
        <div className="character-cards">
          {characterArray.map((character) => (
            <Character
              character={character}
              sessions={sessions}
              player={currentPlayer}
            />
          ))}
        </div>
      </div>
      <TestCharacters characters={characterArray} sessions={sessions} />
      <TestSessions characters={characters} sessions={sessions} />
      <TestEncounters />
      <TestImages name="Eslyn Juhlenath.jpeg" />
    </div>
  );
}

export default App;
