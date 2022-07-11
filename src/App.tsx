import { Stack } from "@fluentui/react";
import { useDispatch, useSelector } from "react-redux";

import { get, getDatabase, onValue, ref } from "firebase/database";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import DataHelper from "./Helpers/DataHelper";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./Style/App.scss";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import Login from "./Components/Login";
import Dashboard from "./Components/Dashboard";

import ICharacterData from "./Interfaces/ICharacterData";
import ISessionData from "./Interfaces/ISessionData";
import IPlayerData from "./Interfaces/IUserData";

import Everwilds from "./Images/Maps/The Everwilds - Preview.jpg";
import ForgottenLands from "./Images/Maps/The Forgotten Lands - Preview.jpg";
import LunarIsles from "./Images/Maps/The Lunar Isles - Preview.jpg";
import ShatteredRealms from "./Images/Maps/The Shattered Realms - Preview.jpg";

import RegistrationDialog from "./Components/Dialogs/RegistrationDialog";
import CharacterCreationDialog from "./Components/Dialogs/CharacterCreationDialog";
import SessionCreationDialog from "./Components/Dialogs/SessionCreationDialog";
import CharacterRetirementDialog from "./Components/Dialogs/CharacterRetirementDialog";
import SessionManagementDialog from "./Components/Dialogs/SessionManagementDialog";
import AccountNameManagementDialog from "./Components/Dialogs/AccountNameManagementDialog";
import PasswordManagementDialog from "./Components/Dialogs/PasswordManagementDialog";
import CharacterManagementDialog from "./Components/Dialogs/CharacterManagementDialog";
import TokenCreatorDialog from "./Components/Dialogs/TokenCreatorDialog";
import NewRaceDialog from "./Components/Dialogs/NewRaceDialog";
import NewSubraceDialog from "./Components/Dialogs/NewSubraceDialog";
import SessionRegistrationDialog from "./Components/Dialogs/SessionRegistrationDialog";

const isDevMode = window.location.hostname === "localhost";

const firebaseConfig = {
  apiKey: "AIzaSyDJLonhBywTBq-R2AyP5Hvcg2Lp-gUMogk",
  authDomain: "into-the-west-5869d.firebaseapp.com",
  databaseURL: isDevMode
    ? "https://into-the-test.europe-west1.firebasedatabase.app"
    : "https://into-the-west.europe-west1.firebasedatabase.app",
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

  const authUser = useSelector((state) => state.authUser);

  onValue(ref(db, "characters"), (snapshot) => {
    const characterData = snapshot.val() as ICharacterData[];

    const characters = Object.keys(characterData)
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
      });

    dispatch({
      type: "SetCharacters",
      characters: {
        isLoading: false,
        data: characters,
      },
    });
  });

  onValue(ref(db, "sessions"), (snapshot) => {
    const sessionData = snapshot.val() as ISessionData[];

    const sessions = Object.keys(sessionData)
      .map((key) => {
        return DataHelper.parseSessionData(sessionData[key], key);
      })
      .sort((sessionA, sessionB) =>
        DataHelper.sortNullableDatesDescending(sessionA.date, sessionB.date)
      );

    dispatch({
      type: "SetSessions",
      sessions: {
        isLoading: false,
        data: sessions,
      },
    });
  });

  onValue(ref(db, "players"), (snapshot) => {
    const playerData = snapshot.val() as IPlayerData[];

    const players = Object.keys(playerData).map((key) => {
      const player = playerData[key];

      return DataHelper.parsePlayerData(player, key);
    });

    dispatch({
      type: "SetPlayers",
      players: {
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

  onValue(ref(db, "events"), (snapshot) => {
    const snapVal = snapshot.val();

    const data = Object.keys(snapVal).map((key) => {
      const event = snapVal[key];
      event.key = key;

      return event;
    });

    dispatch({
      type: "SetEvents",
      events: {
        isLoading: false,
        data: data,
      },
    });
  });

  onValue(ref(db, "eventInterests"), (snapshot) => {
    const snapVal = snapshot.val();

    const data = Object.keys(snapVal).map((key) => {
      const eventInterest = snapVal[key];
      eventInterest.key = key;

      return eventInterest;
    });

    dispatch({
      type: "SetEventInterests",
      eventInterests: {
        isLoading: false,
        data: data,
      },
    });
  });

  onValue(ref(db, "newCharacters"), (snapshot) => {
    const snapVal = snapshot.val();

    const data = Object.keys(snapVal).map((key) => {
      const newCharacter = snapVal[key];
      newCharacter.key = key;

      return newCharacter;
    });

    dispatch({
      type: "SetNewCharacters",
      newCharacters: {
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
      type: "SetMaps",
      maps: {
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

      const playersRef = ref(db, "players/" + user.uid);

      const playerData = await get(playersRef)
        .then((response) => response.val())
        .catch((e) => console.error("error", e));

      dispatch({
        type: "SetCurrentPlayer",
        currentPlayer: {
          isLoading: false,
          data: DataHelper.parsePlayerData(playerData, user.uid),
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
          backdropFilter: "grayscale(30%) blur(50%)",
        },
      }}
    >
      {authUser ? (
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
          <CharacterManagementDialog />
          <TokenCreatorDialog />
          <NewRaceDialog />
          <NewSubraceDialog />
          <SessionRegistrationDialog />
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
