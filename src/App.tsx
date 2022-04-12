import { Stack } from "@fluentui/react";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import "./Style/App.scss";
import CharacterTable from "./Components/CharacterTable";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import SessionTable from "./Components/SessionTable";
import CharacterCreationDialog from "./Components/CharacterCreationDialog";
import SessionCreationDialog from "./Components/SessionCreationDialog";
import Data from "./Data/MainData";
import ICharacterData from "./Interfaces/ICharacterData";
import ISessionData from "./Interfaces/ISessionData";
import IPlayerData from "./Interfaces/IPlayerData";

import firebase, {
  getDatabase,
  connectDatabaseEmulator,
  onValue,
  ref,
} from "firebase/database";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
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

const App = () => {
  const dispatch = useDispatch();

  initializeApp(firebaseConfig);
  const db = getDatabase();

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
            const character = sessionData[key];
            character.key = key;
            return character;
          })
          .sort((sessionA, sessionB) =>
            sessionB.date.localeCompare(sessionA.date)
          ),
      },
    });
  });

  return (
    <Stack
      verticalFill
      className="app-container"
      horizontalAlign="center"
      verticalAlign="center"
      styles={{
        root: {
          maxWidth: "100%",
          textAlign: "center",
          height: "100vh",
        },
      }}
      tokens={{ childrenGap: 20 }}
    >
      <Header />
      <Stack
        className="body-container"
        verticalFill
        horizontal
        tokens={{ childrenGap: 50 }}
        styles={{ root: { overflowY: "auto" } }}
      >
        <CharacterTable />
        <SessionTable />
      </Stack>
      <CharacterCreationDialog />
      <SessionCreationDialog />
      <Footer />
    </Stack>
  );
};
export default App;
