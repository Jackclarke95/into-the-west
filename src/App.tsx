import { Stack } from "@fluentui/react";
import { useDispatch, useSelector } from "react-redux";
import "./Style/App.scss";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import CharacterCreationDialog from "./Components/Dialogs/CharacterCreationDialog";
import SessionCreationDialog from "./Components/Dialogs/SessionCreationDialog";
import CharacterRetirementDialog from "./Components/Dialogs/CharacterRetirementDialog";
import ICharacterData from "./Interfaces/ICharacterData";
import ISessionData from "./Interfaces/ISessionData";
import IPlayerData from "./Interfaces/IPlayerData";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { getDatabase, onValue, ref } from "firebase/database";
import { initializeApp } from "firebase/app";
import Dashboard from "./Components/Dashboard";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import Login from "./Components/Login";
import RegistrationDialog from "./Components/Dialogs/RegistrationDialog";

const firebaseConfig = {
  apiKey: "AIzaSyDJLonhBywTBq-R2AyP5Hvcg2Lp-gUMogk",
  authDomain: "into-the-west-5869d.firebaseapp.com",
  databaseURL:
    "https://into-the-west-5869d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "into-the-west-5869d",
  storageBucket: "into-the-west-5869d.appspot.com",
  messagingSenderId: "1019951241923",
  appId: "1:1019951241923:web:960fbf221acc3fd05fa076",
};

initializeApp(firebaseConfig);

export const db = getDatabase();

const App = () => {
  const dispatch = useDispatch();

  const user = useSelector((state: any) => state.user);

  onValue(ref(db, "characters"), (snapshot) => {
    const characterData = snapshot.val() as ICharacterData[];

    dispatch({
      type: "SetCharacters",
      characters: {
        isLoading: false,
        data: Object.keys(characterData)
          .map((key) => {
            const character = characterData[key];
            character.key = key;
            return character;
          })
          .sort((characterA, characterB) =>
            characterA.name.localeCompare(characterB.name)
          )
          .sort((characterA, characterB) => {
            if (characterA.retirement && !characterB.retirement) {
              return 1;
            } else if (!characterA.retirement && characterB.retirement) {
              return -1;
            } else return 0;
          }),
      },
    });
  });

  onValue(ref(db, "sessions"), (snapshot) => {
    const sessionData = snapshot.val() as ISessionData[];

    dispatch({
      type: "SetSessions",
      sessions: {
        isLoading: false,
        data: Object.keys(sessionData)
          .map((key) => {
            const session = sessionData[key];
            session.key = key;
            return session;
          })
          .sort((sessionA, sessionB) =>
            sessionB.date.localeCompare(sessionA.date)
          ),
      },
    });
  });

  onValue(ref(db, "players"), (snapshot) => {
    const playerData = snapshot.val() as IPlayerData[];

    dispatch({
      type: "SetPlayers",
      players: {
        isLoading: false,
        data: Object.keys(playerData).map((key) => {
          const player = playerData[key];
          player.key = key;
          return player;
        }),
      },
    });
  });

  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      // ...
      console.log(uid);
      console.log("photo url", user.photoURL);

      dispatch({
        type: "SetUser",
        user: user,
      });
    } else {
      // User is signed out
      // ...
      console.log("signed out");
    }
  });

  console.log(user);

  return (
    <Stack
      verticalFill
      horizontalAlign="center"
      verticalAlign="center"
      tokens={{ childrenGap: 20 }}
      styles={{
        root: {
          textAlign: "center",
          height: "100vh",
        },
      }}
    >
      {user ? (
        <>
          <Header />
          <Dashboard />
          <Footer />
          <CharacterCreationDialog />
          <SessionCreationDialog />
          <CharacterRetirementDialog />
        </>
      ) : (
        <>
          <Login />
          <RegistrationDialog />
        </>
      )}
      <ToastContainer hideProgressBar position="top-center" closeButton />
    </Stack>
  );
};

export default App;
