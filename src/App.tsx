import { useState, useEffect } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import TestSessions from "./Components/TestSessions";
import TestEncounters from "./Components/TestEncounters";
import Characters from "./Components/Characters";
import {
  auth,
  firebaseDb,
  signInWithGoogleRedirect,
  signInWithGooglePopup,
} from "./firebase.utils";
import "./App.scss";

function App() {
  const [characters, setCharacters] = useState([] as {}[]);
  const [sessions, setSessions] = useState([] as {}[]);
  const [players, setPlayers] = useState([] as {}[]);
  const [userAccount, setUserAccount] = useState({} as any);
  const [currentPlayer, setCurrentPlayer] = useState();

  auth.onAuthStateChanged((user) => {
    setUserAccount(user);
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
          characterArray.push({ key: child.key, value: child.val() });
        });
        setCharacters(characterArray);
      });

    let playerArray = [] as {}[];

    firebaseDb
      .child("players")
      .orderByChild("name")
      .once("value", (snapshot) => {
        snapshot.forEach((child) => {
          playerArray.push(child.val());
        });
        setPlayers(playerArray);
      });
  }, []);

  if (userAccount && userAccount.uid && !currentPlayer) {
    firebaseDb
      .child("user-accounts")
      .orderByChild("uid")
      .equalTo(userAccount.uid)
      .on("value", (snapshot) => {
        snapshot.forEach((child) => {
          setCurrentPlayer(child.val());
        });
      });
  }

  return (
    <>
      <div className="site-container">
        {userAccount ? (
          <button
            onClick={() => {
              auth.signOut();
              window.location.reload();
            }}
          >
            Sign Out
          </button>
        ) : (
          <>
            <BrowserView>
              <button onClick={signInWithGooglePopup}>
                Sign In with Google
              </button>
            </BrowserView>
            <MobileView>
              <button onClick={signInWithGoogleRedirect}>
                Sign In with Google
              </button>
            </MobileView>
          </>
        )}
        <h1
          style={{
            textAlign: "center",
            fontFamily: "Papyrus",
            fontSize: "3em",
            fontWeight: "bold",
          }}
        >
          Into The West
        </h1>
        <Characters
          characters={characters}
          sessions={sessions}
          players={players}
          currentUser={currentPlayer}
        />
        <TestEncounters />
        <TestSessions
          characters={characters}
          sessions={sessions}
          player={currentPlayer}
        />
      </div>
      <BrowserView>
        <img
          className="background-image"
          src={`${process.env.PUBLIC_URL}/Images/Maps/Hewett's Map.jpg`}
          alt="Background Map"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: -1,
            opacity: 0.3,
            filter: "grayscale(100%)",
            width: "100%",
          }}
        />
      </BrowserView>
    </>
  );
}

export default App;
