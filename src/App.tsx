import React, { useState, useEffect } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import Character from "./Components/Character";
import TestSessions from "./Components/TestSessions";
import TestEncounters from "./Components/TestEncounters";
import firebase, {
  auth,
  firebaseDb,
  firestore,
  signInWithGoogleRedirect,
  signInWithGooglePopup,
} from "./firebase.utils";
import "./App.scss";

function App() {
  const [characters, setCharacters] = useState([] as {}[]);
  const [sessions, setSessions] = useState([] as {}[]);
  const [user, setUser] = useState({} as any);
  const [currentPlayer, setCurrentPlayer] = useState();

  auth.onAuthStateChanged((user) => {
    setUser(user);
  });

  useEffect(() => {
    let sessionArray = [] as {}[];
    firebaseDb
      .child("sessions")
      .orderByChild("scheduled-date")
      .on("value", (snapshot) => {
        snapshot.forEach((child) => {
          sessionArray.push(child.val());
        });
        setSessions(sessionArray);
      });

    let characterArray = [] as {}[];

    firebaseDb
      .child("characters")
      .orderByChild("name")
      .once("value", (snapshot) => {
        snapshot.forEach((child) => {
          characterArray.push(child.val());
        });
        setCharacters(characterArray);
      });
  }, []);

  console.log(characters);

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

  return (
    <div>
      {user ? (
        <button
          onClick={() => {
            auth.signOut();
            // setCurrentPlayer(null);
          }}
        >
          Sign Out
        </button>
      ) : (
        <>
          <BrowserView>
            <button onClick={signInWithGooglePopup}>Sign In with Google</button>
          </BrowserView>
          <MobileView>
            <button onClick={signInWithGoogleRedirect}>
              Sign In with Google
            </button>
          </MobileView>
        </>
      )}
      <h1>Into The West</h1>
      <div className="characters" style={{ textAlign: "center" }}>
        <div className="character-cards">
          {Object.keys(characters).map((key) => (
            <Character
              character={characters[key]}
              characterKey={key}
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
