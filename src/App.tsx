import { ScrollablePane, Stack, Sticky } from "@fluentui/react";
import { useDispatch, useSelector } from "react-redux";

import { getDatabase, onValue, ref } from "firebase/database";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import DataHelper from "./Helpers/DataHelper";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./Style/App.scss";
import DesktopHeader from "./Components/DesktopHeader";
import DesktopFooter from "./Components/DesktopFooter";
import Login from "./Components/Login";
import DesktopDashboard from "./Components/DesktopDashboard";

import Everwilds from "./Images/Maps/The Everwilds - Preview.jpg";
import ForgottenLands from "./Images/Maps/The Forgotten Lands - Preview.jpg";
import LunarIsles from "./Images/Maps/The Lunar Isles - Preview.jpg";
import ShatteredRealms from "./Images/Maps/The Shattered Realms - Preview.jpg";

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
import { BrowserView, MobileView } from "react-device-detect";
import DataParse from "./Components/DataParse";
import React from "react";
import MobileHeader from "./Components/MobileHeader";
import MobileDashboard from "./Components/MobileDashboard";
import MobileFooter from "./Components/MobileFooter";

console.log(process.env);

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

console.log(firebaseConfig);

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

  return (
    <React.Fragment>
      <DataParse>
        {authUser ? (
          <React.Fragment>
            <BrowserView>
              <Stack
                className="app-container"
                verticalFill
                horizontalAlign="center"
                verticalAlign="center"
                styles={{
                  root: {
                    textAlign: "center",
                    height: "100vh",
                    backgroundImage: authUser
                      ? `url("${DataHelper.getRandomFromArray([
                          Everwilds,
                          ForgottenLands,
                          LunarIsles,
                          ShatteredRealms,
                        ])}")`
                      : "",
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundComposite: "saturation",
                  },
                }}
              >
                <DesktopHeader />
                <DesktopDashboard />
                <DesktopFooter />
              </Stack>
            </BrowserView>
            <MobileView>
              <ScrollablePane>
                <Sticky>
                  <MobileHeader />
                </Sticky>
                <MobileDashboard />
                <Sticky>
                  <MobileFooter />
                </Sticky>
              </ScrollablePane>
            </MobileView>
          </React.Fragment>
        ) : (
          <>
            <Login />
          </>
        )}
      </DataParse>
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
      <ConfirmationDialog />
    </React.Fragment>
  );
};

export default App;
