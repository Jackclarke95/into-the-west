import { useState, useEffect } from "react";
import { BrowserView } from "react-device-detect";
import UserBanner from "./Components/UserBanner";
import Sessions from "./Components/Sessions";
import PastSessions from "./Components/PastSessions";
import FutureSessions from "./Components/FutureSessions";
import ActiveCharacters from "./Components/ActiveCharacters";
import RetiredCharacters from "./Components/RetiredCharacters";
import { auth, firebaseDb } from "./firebase.utils";
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
          sessionArray.push({ key: child.key, value: child.val() });
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

  let characterData = [] as any[];

  Object.keys(characters).map((key) => {
    characterData.push(characters[key].value);
  });

  let sessionData = [] as any[];

  Object.keys(sessions).map((key) => {
    sessionData.push(sessions[key].value);
  });

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
          sessions={sessionData}
          players={players}
          currentPlayer={currentPlayer}
        />
        <Sessions
          characterData={characterData}
          sessions={sessions}
          players={players}
          currentPlayer={currentPlayer}
        />
        <RetiredCharacters
          characters={characters}
          sessions={sessionData}
          players={players}
          currentPlayer={currentPlayer}
        />
      </div>
      <BrowserView>
        <img
          className="background-image"
          src={`${process.env.PUBLIC_URL}/Images/Maps/Hewett's Map.jpg`}
          alt="Background Map"
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: -1,
            opacity: 0.3,
            filter: "grayscale(100%)",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </BrowserView>
    </>
  );
}

export default App;
