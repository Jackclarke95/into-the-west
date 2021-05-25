import { useState, useEffect } from "react";
import { BrowserView, MobileView } from "react-device-detect";
import UserBanner from "./Components/UserBanner";
import TestSessions from "./Components/TestSessions";
import TestEncounters from "./Components/TestEncounters";
import ActiveCharacters from "./Components/ActiveCharacters";
import RetiredCharacters from "./Components/RetiredCharacters";
import {
  auth,
  signOut,
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
    console.log("currentPlayer", currentPlayer);
  }

  return (
    <>
      <UserBanner user={userAccount} currentPlayer={currentPlayer} />
      <div
        className="site-container"
        style={{
          maxWidth: "1920px",
          margin: "auto",
          padding: "1.5em",
        }}
      >
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
        <ActiveCharacters
          characters={characters}
          sessions={sessions}
          players={players}
          currentPlayer={currentPlayer}
        />
        <RetiredCharacters
          characters={characters}
          sessions={sessions}
          players={players}
          currentPlayer={currentPlayer}
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
