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
import Data from "./Data/Data";
import ICharacterData from "./Interfaces/ICharacterData";
import ISessionData from "./Interfaces/ISessionData";
import IPlayerData from "./Interfaces/IPlayerData";

export default () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({
      type: "SetCharacters",
      characters: {
        isLoading: false,
        data: Object.keys(Data.characters)
          .map((key) => Data.characters[key] as ICharacterData)

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

    dispatch({
      type: "SetSessions",
      sessions: {
        isLoading: false,
        data: Object.keys(Data.sessions)
          .map((key) => Data.sessions[key] as ISessionData)
          .sort((sessionA, sessionB) =>
            sessionB.date.localeCompare(sessionA.date)
          ),
      },
    });

    dispatch({
      type: "SetPlayers",
      players: {
        isLoading: false,
        data: Object.keys(Data.players).map(
          (key) => Data.players[key] as IPlayerData
        ),
      },
    });
  }, []);

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
