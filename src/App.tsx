import { Stack } from "@fluentui/react";
import { useDispatch, useSelector } from "react-redux";

import { getDatabase, onValue, ref } from "firebase/database";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import DesktopHeader from "./Components/DesktopHeader";
import DesktopFooter from "./Components/DesktopFooter";
import Login from "./Components/Login";

import RegistrationDialog from "./Components/Dialogs/RegistrationDialog";
import CharacterCreationDialog from "./Components/Dialogs/CharacterCreationDialog";
import SessionCreationDialog from "./Components/Dialogs/SessionCreationDialog";
import SessionManagementDialog from "./Components/Dialogs/SessionManagementDialog";
import AccountNameManagementDialog from "./Components/Dialogs/AccountNameManagementDialog";
import PasswordManagementDialog from "./Components/Dialogs/PasswordManagementDialog";
import CharacterManagementDialog from "./Components/Dialogs/CharacterManagementDialog";
import NewRaceDialog from "./Components/Dialogs/NewRaceDialog";
import NewSubraceDialog from "./Components/Dialogs/NewSubraceDialog";
import SessionRegistrationDialog from "./Components/Dialogs/SessionRegistrationDialog";
import { PlayerData } from "./Types/DatabaseStructures";
import ConfirmationDialog from "./Components/Dialogs/ConfirmationDialog";
import DataParse from "./Components/DataParse";
import React from "react";
import SessionCompletionDialog from "./Components/Dialogs/SessionCompletionDialog";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HomePage from "./Components/Pages/HomePage";
import CharactersPage from "./Components/Pages/CharactersPage";
import SessionsPage from "./Components/Pages/SessionsPage";
import ProfilePage from "./Components/Pages/ProfilePage";
import NavigationBar from "./Components/NavigationBar";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

initializeApp(firebaseConfig);

export const db = getDatabase();
export const auth = getAuth();

const App = () => {
  const dispatch = useDispatch();

  const authUser = useSelector((state) => state.authUser);

  onValue(ref(db, "players"), (snapshot) => {
    const playerData = snapshot.val() as PlayerData[];

    const players = Object.keys(playerData).map((key) => {
      const player = playerData[key];
      player.key = key;

      return player;
    });

    dispatch({
      type: "SetDatabasePlayers",
      databasePlayers: {
        isLoading: false,
        data: players,
      },
    });
  });

  onValue(ref(db, "races"), (snapshot) => {
    const snapVal = snapshot.val();

    const races = Object.keys(snapVal).map((key) => {
      const race = snapVal[key];
      race.key = key;

      return race;
    });

    dispatch({
      type: "SetRaces",
      races: {
        isLoading: false,
        data: races,
      },
    });
  });

  onValue(ref(db, "subraces"), (snapshot) => {
    const snapVal = snapshot.val();

    const data = Object.keys(snapVal).map((key) => {
      const race = snapVal[key];
      race.key = key;

      return race;
    });

    dispatch({
      type: "SetSubraces",
      subraces: {
        isLoading: false,
        data: data,
      },
    });
  });

  onValue(ref(db, "raceConfigs"), (snapshot) => {
    const snapVal = snapshot.val();

    const data = Object.keys(snapVal).map((key) => {
      const race = snapVal[key];
      race.key = key;

      return race;
    });

    dispatch({
      type: "SetRaceConfigs",
      raceConfigs: {
        isLoading: false,
        data: data,
      },
    });
  });

  onValue(ref(db, "classes"), (snapshot) => {
    const snapVal = snapshot.val();

    const data = Object.keys(snapVal).map((key) => {
      const datum = snapVal[key];
      datum.key = key;

      return datum;
    });

    dispatch({
      type: "SetClasses",
      classes: {
        isLoading: false,
        data: data,
      },
    });
  });

  onValue(ref(db, "subclasses"), (snapshot) => {
    const snapVal = snapshot.val();

    const data = Object.keys(snapVal).map((key) => {
      const datum = snapVal[key];
      datum.key = key;

      return datum;
    });

    dispatch({
      type: "SetSubclasses",
      subclasses: {
        isLoading: false,
        data: data,
      },
    });
  });

  onValue(ref(db, "classConfigs"), (snapshot) => {
    const snapVal = snapshot.val();

    const data = Object.keys(snapVal).map((key) => {
      const race = snapVal[key];
      race.key = key;

      return race;
    });

    dispatch({
      type: "SetClassConfigs",
      classConfigs: {
        isLoading: false,
        data: data,
      },
    });
  });

  onValue(ref(db, "sessions"), (snapshot) => {
    const snapVal = snapshot.val();

    const data = Object.keys(snapVal).map((key) => {
      const session = snapVal[key];
      session.key = key;

      return session;
    });

    dispatch({
      type: "SetDatabaseSessions",
      databaseSessions: {
        isLoading: false,
        data: data,
      },
    });
  });

  onValue(ref(db, "sessionInterests"), (snapshot) => {
    const snapVal = snapshot.val();

    const data = Object.keys(snapVal).map((key) => {
      const sessionInterest = snapVal[key];
      sessionInterest.key = key;

      return sessionInterest;
    });

    dispatch({
      type: "SetSessionInterests",
      sessionInterests: {
        isLoading: false,
        data: data,
      },
    });
  });

  onValue(ref(db, "characters"), (snapshot) => {
    const snapVal = snapshot.val();

    const data = Object.keys(snapVal).map((key) => {
      const newCharacter = snapVal[key];
      newCharacter.key = key;

      return newCharacter;
    });

    dispatch({
      type: "SetDatabaseCharacters",
      databaseCharacters: {
        isLoading: false,
        data: data,
      },
    });
  });

  onValue(ref(db, "characterClasses"), (snapshot) => {
    const snapVal = snapshot.val();

    const data = Object.keys(snapVal).map((key) => {
      const characterClass = snapVal[key];
      characterClass.key = key;

      return characterClass;
    });

    dispatch({
      type: "SetCharacterClasses",
      characterClasses: {
        isLoading: false,
        data: data,
      },
    });
  });

  onValue(ref(db, "characterRaces"), (snapshot) => {
    const snapVal = snapshot.val();

    const data = Object.keys(snapVal).map((key) => {
      const characterRace = snapVal[key];
      characterRace.key = key;

      return characterRace;
    });

    dispatch({
      type: "SetCharacterRaces",
      characterRaces: {
        isLoading: false,
        data: data,
      },
    });
  });

  onValue(ref(db, "maps"), (snapshot) => {
    const snapVal = snapshot.val();

    const data = Object.keys(snapVal).map((key) => {
      const map = snapVal[key];
      map.key = key;

      return map;
    });

    dispatch({
      type: "SetDatabaseMaps",
      databaseMaps: {
        isLoading: false,
        data: data,
      },
    });
  });

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      dispatch({
        type: "SetAuthUser",
        authUser: user,
      });
    }
  });

  const pageContentStyles = {
    root: {
      textAlign: "center",
      height: "100vh",
      width: 1200,
      backgroundColor: "white",
    },
  };

  return (
    <React.Fragment>
      {authUser ? (
        <DataParse>
          <BrowserRouter>
            <DesktopHeader />
            <Stack
              className="page-content"
              styles={pageContentStyles}
              horizontalAlign="center"
            >
              <NavigationBar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/characters" element={<CharactersPage />} />
                <Route path="/sessions" element={<SessionsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
              </Routes>
            </Stack>
            <DesktopFooter />
          </BrowserRouter>
        </DataParse>
      ) : (
        <>
          <Login />
        </>
      )}
      <ToastContainer
        hideProgressBar
        position="top-center"
        closeButton
        autoClose={1500}
      />
      <RegistrationDialog />
      <CharacterCreationDialog />
      <SessionCreationDialog />
      <SessionManagementDialog />
      <AccountNameManagementDialog />
      <PasswordManagementDialog />
      <CharacterManagementDialog />
      <NewRaceDialog />
      <NewSubraceDialog />
      <SessionRegistrationDialog />
      <SessionCompletionDialog />
      <ConfirmationDialog />
    </React.Fragment>
  );
};

export default App;
