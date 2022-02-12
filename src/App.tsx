import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Stack,
  Text,
  FontWeights,
  IStackTokens,
  IStackStyles,
  ITextStyles,
  Persona,
  PersonaSize,
  List,
  ProgressIndicator,
  Label,
  Dialog,
  DialogType,
  TextField,
  PrimaryButton,
  DefaultButton,
  Dropdown,
  IDropdownStyles,
  DatePicker,
  Link,
  Panel,
  ThemeProvider,
  FontSizes,
} from "@fluentui/react";
import { initializeIcons } from "@fluentui/react/lib/Icons";

import { parseCharacterData, parseSessionData } from "./Helpers/DataParser";
import { auth, firebaseDb, firestore } from "./firebase.utils";
import "./Style/App.scss";
import {
  darkRedTheme as darkTheme,
  lightRedTheme as lightTheme,
} from "./Style/Themes";
import ISessionData from "./Interfaces/ISessionData";
import ICharacterData from "./Interfaces/ICharacterData";
import { CharacterCreationPanel } from "./Components/CharacterCreationPanel";
import { Characters } from "./Components/Characters";
import { Sessions } from "./Components/Sessions";
import { Commands } from "./Components/CommandBar";

export default () => {
  const dispatch = useDispatch();

  const [userAccount, setUserAccount] = useState({} as any);
  const [showCharacterCreationPanel, setShowCharacterCreationPanel] =
    useState(false);
  const [name, setName] = useState("");
  const [useDarkTheme, setUseDarkTheme] = useState(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [themeOverride, setThemeOverride] = useState(false);

  const sessions = useSelector((state) => state.sessions);

  auth.onAuthStateChanged((user) => {
    setUserAccount(user);
  });

  initializeIcons();

  // Get Sessions data from Firebase Realtime Database
  useEffect(() => {
    firebaseDb
      .child("sessions")
      .orderByChild("scheduled-date")
      .on("value", (snapshot) => {
        const data = [] as { key: string | null; value: ISessionData }[];

        snapshot.forEach((child) => {
          data.push({ key: child.key, value: child.val() });
        });

        dispatch({
          type: "SetSessions",
          sessions: data.map((session) => parseSessionData(session)),
        });
      });
  }, [firebaseDb]);

  // Get Characters data from Firebase Realtime Database
  useEffect(() => {
    firebaseDb
      .child("characters")
      .orderByChild("name")
      .on("value", async (snapshot) => {
        const data = [] as {
          key: string | null;
          value: ICharacterData;
        }[];

        snapshot.forEach((child) => {
          data.push({ key: child.key, value: child.val() });

          if (!child.key) {
            return;
          }
        });

        const charactersToDispatch = data.map((character) =>
          parseCharacterData(character, sessions)
        );

        // Redux version
        dispatch({
          type: "SetCharacters",
          characters: charactersToDispatch,
        });
      });
  }, [firebaseDb]);

  // const createCharacter = () => {
  //   const character = reduxCharacters[0];

  //   const characterData = {
  //     classes: character.classes,
  //     id: new Date().getTime(),
  //     name: character.name,
  //     race: character.race,
  //     ["starting-level"]: character.startingLevel,
  //   } as ICharacterData;

  //   if (window.confirm(`Create new Character?`)) {
  //     firebaseDb
  //       .child(`characters/`)
  //       .push(characterData)
  //       .catch((e) =>
  //         alert(
  //           `Failed to claim Character. Verify that you are connected to the internet. Please try again.\n\nDetails:\n${e}`
  //         )
  //       );
  //   }
  // };

  // const dropdownStyles: Partial<IDropdownStyles> = {
  //   dropdown: { width: 300 },
  // };

  // const createSession = () => {
  //   const data = sessionData[0];

  //   const session = data.value;

  //   if (window.confirm(`Create new Session?`)) {
  //     firebaseDb
  //       .child(`sessions/`)
  //       .push(session)
  //       .catch((e) => alert(`Failed to create Session.\n\nDetails:\n${e}`));
  //   }
  // };

  const stackStyles: Partial<IStackStyles> = {
    root: {
      width: "100%",
      margin: "0 auto",
      textAlign: "center",
      color: "#605e5c",
      display: "flex",
      flexDirection: "column",
      maxHeight: "100vh",
    },
  };

  const enableCharacterCreationPanel = (shouldShow) => {
    setShowCharacterCreationPanel(shouldShow);
  };

  const getTheme = () => {
    return useDarkTheme ||
      (window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches &&
        !themeOverride)
      ? darkTheme
      : lightTheme;
  };

  // console.log("redux sessions", reduxSessions);
  // console.log("redux characters", reduxCharacters);
  // console.log("redux images", reduxImages);

  return (
    <ThemeProvider theme={getTheme()}>
      <Stack horizontal>
        <Stack
          verticalAlign="start"
          verticalFill
          styles={stackStyles}
          tokens={{ childrenGap: 10 }}
        >
          <Text style={{ fontSize: FontSizes.mega }}>Into the West</Text>
          <Commands
            // createCharacter={createCharacter}
            // createSession={createSession}
            toggleCharacterCreationPanel={(shouldShow) =>
              enableCharacterCreationPanel(shouldShow)
            }
            useDarkTheme={useDarkTheme}
            toggleTheme={(useDarkTheme) => setUseDarkTheme(useDarkTheme)}
            setThemeOverride={(useDarkTheme) => setThemeOverride(useDarkTheme)}
          />
          <Stack
            horizontal
            styles={{
              root: { overflowY: "auto", justifyContent: "space-evenly" },
            }}
          >
            <Characters />
            <Sessions />
          </Stack>
        </Stack>
        <CharacterCreationPanel
          shouldShowCharacterCreationPanel={showCharacterCreationPanel}
          toggleCharacterCreationPanel={(shouldShow) =>
            enableCharacterCreationPanel(shouldShow)
          }
        />
      </Stack>
    </ThemeProvider>
  );
};
