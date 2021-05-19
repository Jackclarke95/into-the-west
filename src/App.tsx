import React, { useState, useEffect } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import Character from "./Components/Character";
import TestSessions from "./Components/TestSessions";
import TestEncounters from "./Components/TestEncounters";
import firebase, {
  auth,
  firebaseDb,
  firestore,
  signInWithGoogle,
  provider,
} from "./firebase.utils";
import "./App.scss";

function App() {
  const [characters, setCharacters] = useState({});
  const [sessions, setSessions] = useState({});
  const [user, setUser] = useState({} as any);
  const [currentPlayer, setCurrentPlayer] = useState();

  const signInPopup = () => {
    auth.signInWithPopup(provider);
  };

  const signInRedirect = () => {
    auth.signInWithRedirect(provider);
  };

  auth.onAuthStateChanged((user) => {
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
    firebaseDb
      .child("players")
      .orderByChild("uid")
      .equalTo(user.uid)
      .on("value", (snapshot) => {
        if (snapshot.val() != null) {
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
      <BrowserView>
        <button onClick={signInPopup}>Sign In with Google</button>
      </BrowserView>
      <MobileView>
        <button onClick={signInRedirect}>Sign In with Google</button>
      </MobileView>
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
      <TestEncounters />
      <TestSessions characters={characters} sessions={sessions} />
    </div>
  );
}

export default App;
