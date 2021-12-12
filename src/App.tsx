import { useState, useEffect } from "react";
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

import { Commands } from "./Components/CommandBar";

import {
  calculateSessionsForLevelUp,
  calculateLevelFromSessions,
  countSessionsAttended,
  getOrdinal,
  getMainClass,
  getMainClassColour,
  getCharacterClasses,
  calculateMaxSessionsToNextLevel,
} from "./Helpers/DataHelper";
import { parseCharacterData, parseSessionData } from "./Helpers/DataParser";
import ICharacter from "./Interfaces/ICharacter";
import ISession from "./Interfaces/ISession";
import { auth, firebaseDb, firestore } from "./firebase.utils";
import "./Style/App.scss";
import {
  darkRedTheme as darkTheme,
  lightRedTheme as lightTheme,
} from "./Style/Themes";
import ISessionData from "./Interfaces/ISessionData";
import ICharacterData from "./Interfaces/ICharacterData";
import { CharacterCreationPanel } from "./Components/CharacterCreationPanel";
import { CharacterPersona } from "./Components/CharacterPersona";
import { Sessions } from "./Components/Sessions";

const App = () => {
  const [userAccount, setUserAccount] = useState({} as any);
  const [sessionData, setSessionData] = useState(
    [] as { key: string | null; value: ISessionData }[]
  );
  const [characterData, setCharacterData] = useState(
    [] as { key: string | null; value: ICharacterData }[]
  );
  const [characters, setCharacters] = useState([] as ICharacter[]);
  const [sessions, setSessions] = useState([] as ISession[]);
  const [showCharacterCreationPanel, setShowCharacterCreationPanel] =
    useState(false);
  const [name, setName] = useState("");
  const [useDarkTheme, setUseDarkTheme] = useState(
    window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
  );
  const [themeOverride, setThemeOverride] = useState(false);
  const [characterImages, setCharacterImages] = useState(
    [] as { characterId: number; imageUrl: string }[]
  );

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

        setSessionData(data);
      });
  }, [firebaseDb]);

  // Get Characters data from Firebase Realtime Database
  useEffect(() => {
    firebaseDb
      .child("characters")
      .orderByChild("name")
      .on("value", (snapshot) => {
        const data = [] as { key: string | null; value: ICharacterData }[];

        snapshot.forEach((child) => {
          data.push({ key: child.key, value: child.val() });
        });

        setCharacterData(data);
      });
  }, [firebaseDb]);

  // Set Sessions from Session data from Firebase Realtime Database
  useEffect(() => {
    setSessions(parseSessionData(sessionData));
  }, [sessionData]);

  // Set Characters from Character data from Firebase Realtime Database
  useEffect(() => {
    setCharacters(parseCharacterData(characterData, sessions));
  }, [characterData, sessions]);

  useEffect(() => {
    var charImages = [] as { characterId: number; imageUrl: string }[];

    characters.map((character) => {
      firestore
        .ref(`Avatars/${character.id}.jpeg`)
        .getDownloadURL()
        .then((url) => {
          charImages.push({ characterId: character.id, imageUrl: url });
        })
        .catch(() => {
          charImages.push({
            characterId: character.id,
            imageUrl:
              "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/characters/default-avatar-builder.png",
          });
        });
    });

    setCharacterImages(charImages);
  }, [characters, firestore]);

  const createCharacter = () => {
    const character = characters[0];

    const characterData = {
      classes: character.classes,
      id: new Date().getTime(),
      name: character.name,
      race: character.race,
      ["starting-level"]: character.startingLevel,
    } as ICharacterData;

    if (window.confirm(`Create new Character?`)) {
      firebaseDb
        .child(`characters/`)
        .push(characterData)
        .catch((e) =>
          alert(
            `Failed to claim Character. Verify that you are connected to the internet. Please try again.\n\nDetails:\n${e}`
          )
        );
    }
  };

  const dropdownStyles: Partial<IDropdownStyles> = {
    dropdown: { width: 300 },
  };

  const createSession = () => {
    const data = sessionData[0];

    const session = data.value;

    if (window.confirm(`Create new Session?`)) {
      firebaseDb
        .child(`sessions/`)
        .push(session)
        .catch((e) => alert(`Failed to create Session.\n\nDetails:\n${e}`));
    }
  };

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
            createCharacter={createCharacter}
            createSession={createSession}
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
            <Stack
              styles={{ root: { width: "45%", overflowY: "auto" } }}
              tokens={{ childrenGap: 10 }}
            >
              <Text style={{ fontSize: FontSizes.superLarge }}>Characters</Text>
              {characters.map((character) => (
                <CharacterPersona
                  character={character}
                  characterImages={characterImages}
                />
              ))}
            </Stack>
            <Sessions
              characters={characters}
              sessions={sessions}
              characterImages={characterImages}
            />
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

export default App;
