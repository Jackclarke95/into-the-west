import { Pivot, PivotItem, Stack } from "@fluentui/react";
import { useDispatch, useSelector } from "react-redux";
import "./Style/App.scss";
import CharacterTable from "./Components/CharacterTable";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import SessionTable from "./Components/SessionTable";
import CharacterCreationDialog from "./Components/CharacterCreationDialog";
import SessionCreationDialog from "./Components/SessionCreationDialog";
import ICharacterData from "./Interfaces/ICharacterData";
import ISessionData from "./Interfaces/ISessionData";
import IPlayerData from "./Interfaces/IPlayerData";

import { getDatabase, onValue, ref } from "firebase/database";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import Dashboard from "./Components/Dashboard";
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

  const dataToDisplay = useSelector((state) => state.dataToDisplay);

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

  const dataToRender = () => {
    switch (dataToDisplay) {
      case "Dashboard":
        return <Dashboard />;
      case "CharacterTable":
        return <CharacterTable />;
      case "SessionTable":
        return <SessionTable />;
      default:
        return <Dashboard />;
    }
  };

  const onClickPivotLink = (
    item?: PivotItem | undefined,
    _?: React.MouseEvent<HTMLElement, MouseEvent> | undefined
  ) => {
    let dataToDisplay: "Dashboard" | "CharacterTable" | "SessionTable";

    if (item?.props.headerText) {
      switch (item?.props.headerText) {
        case "Dashboard": {
          dataToDisplay = "Dashboard";
          break;
        }
        case "Characters": {
          dataToDisplay = "CharacterTable";
          break;
        }
        case "Sessions": {
          dataToDisplay = "SessionTable";
          break;
        }
        default: {
          dataToDisplay = "Dashboard";
          break;
        }
      }
    } else {
      throw new Error("No header text found");
    }

    dispatch({
      type: "SetDataToDisplay",
      dataToDisplay,
    });
  };

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
    >
      <Header />
      <Stack
        className="body-container"
        verticalFill
        styles={{ root: { overflowY: "auto", height: "100%" } }}
      >
        <Pivot onLinkClick={onClickPivotLink}>
          <PivotItem headerText="Dashboard" />
          <PivotItem headerText="Characters" />
          <PivotItem headerText="Sessions" />
        </Pivot>
        {dataToRender()}
      </Stack>
      <CharacterCreationDialog />
      <SessionCreationDialog />
      <Footer />
    </Stack>
  );
};

export default App;
