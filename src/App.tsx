import { Stack } from "@fluentui/react";
import { useDispatch, useSelector } from "react-redux";

import { get, getDatabase, onValue, ref } from "firebase/database";
import { initializeApp } from "firebase/app";
import Dashboard from "./Components/Dashboard";

import { getAuth, onAuthStateChanged } from "firebase/auth";
import Login from "./Components/Login";
import RegistrationDialog from "./Components/Dialogs/RegistrationDialog";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./Style/App.scss";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import CharacterCreationDialog from "./Components/Dialogs/CharacterCreationDialog";
import SessionCreationDialog from "./Components/Dialogs/SessionCreationDialog";
import CharacterRetirementDialog from "./Components/Dialogs/CharacterRetirementDialog";
import ICharacterData from "./Interfaces/ICharacterData";
import ISessionData from "./Interfaces/ISessionData";
import IPlayerData from "./Interfaces/IPlayerData";

import Everwilds from "./Images/Maps/The Everwilds - Preview.jpg";
import ForgottenLands from "./Images/Maps/The Forgotten Lands - Preview.jpg";
import LunarIsles from "./Images/Maps/The Lunar Isles - Preview.jpg";
import ShatteredRealms from "./Images/Maps/The Shattered Realms - Preview.jpg";
import DataHelper from "./Helpers/DataHelper";
import SessionManagementDialog from "./Components/Dialogs/SessionManagementDialog";
import AccountNameManagementDialog from "./Components/Dialogs/AccountNameManagementDialog";
import PasswordManagementDialog from "./Components/Dialogs/PasswordManagementDialog";

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
export const auth = getAuth();

const App = () => {
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user);

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

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      dispatch({
        type: "SetUser",
        user: user,
      });

      const playersRef = ref(db, "players/" + user.uid);

      const playerData = await get(playersRef)
        .then((response) => {
          return response.val();
        })
        .catch((e) => console.error("error", e));

      dispatch({
        type: "SetCurrentPlayer",
        currentPlayer: {
          isLoading: false,
          data: playerData,
        },
      });
    }
  });

  return (
    <Stack
      className="app-container"
      verticalFill
      horizontalAlign="center"
      verticalAlign="center"
      styles={{
        root: {
          textAlign: "center",
          height: "100vh",
          backgroundImage: `url("${DataHelper.getRandomFromArray([
            Everwilds,
            ForgottenLands,
            LunarIsles,
            ShatteredRealms,
          ])}")`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundComposite: "saturation",
          backdropFilter: "grayscale(30%) blur(50%)",
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
          <SessionManagementDialog />
          <AccountNameManagementDialog />
          <PasswordManagementDialog />
        </>
      ) : (
        <>
          <Login />
          <RegistrationDialog />
        </>
      )}
      <ToastContainer
        hideProgressBar
        position="top-center"
        closeButton
        autoClose={1500}
      />
    </Stack>
  );
};

export default App;
