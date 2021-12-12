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
import "./App.scss";
import ISessionData from "./Interfaces/ISessionData";
import ICharacterData from "./Interfaces/ICharacterData";
import { CharacterCreationPanel } from "./Components/CharacterCreationPanel";
import { CharacterPersona } from "./Components/CharacterPersona";

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
  const [startingLevel, setStartingLevel] = useState("");

  auth.onAuthStateChanged((user) => {
    setUserAccount(user);
  });

  initializeIcons();

  // Get Sessions data from Firebase
  useEffect(() => {
    firebaseDb
      .child("sessions")
      .orderByChild("scheduled-date")
      .on("value", (snapshot) => {
        const data = [] as { key: string | null; value: ISessionData }[];

        snapshot.forEach((child) => {
          const sessionData = child.val() as ISessionData;

          data.push({ key: child.key, value: sessionData });
        });
        setSessionData(data);
      });
  }, [firebaseDb]);

  // Get Characters data from Firebase
  useEffect(() => {
    firebaseDb
      .child("characters")
      .orderByChild("name")
      .on("value", (snapshot) => {
        const data = [] as { key: string | null; value: ICharacterData }[];

        snapshot.forEach((child) => {
          const characterData = child.val() as ICharacterData;

          data.push({ key: child.key, value: characterData });
        });
        setCharacterData(data);
      });
  }, [firebaseDb]);

  // Set Sessions from Session data from Firebase
  useEffect(() => {
    setSessions(parseSessionData(sessionData));
  }, [sessionData]);

  // Set Characters from Character data from Firebase
  useEffect(() => {
    setCharacters(parseCharacterData(characterData, sessions));
  }, [characterData, sessions]);

  useEffect(() => {
    characterData.forEach((character) => {
      firestore
        .ref(`Avatars/${character.value.id}.jpeg`)
        .getDownloadURL()
        .then((url) => {
          character["avatar-link"] = url;
          setCharacterData([
            ...characterData.filter(
              (data) => data.value.id !== character.value.id
            ),
            character,
          ]);
        });
      // .catch((e) =>
      //   setImageUrl(
      //     "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/characters/default-avatar-builder.png"
      //   )
      // );
    });
  }, []);

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

  console.log("characters:", characters);
  console.log("sessions", sessions);

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

  return (
    <Stack horizontal>
      <Stack
        verticalAlign="start"
        verticalFill
        styles={stackStyles}
        tokens={{ childrenGap: 10 }}
      >
        <Text style={{ fontSize: "3em" }}>Into the West</Text>
        <Commands
          createCharacter={createCharacter}
          createSession={createSession}
          toggleCharacterCreationPanel={(shouldShow) =>
            enableCharacterCreationPanel(shouldShow)
          }
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
            {characters.map((character) => (
              <CharacterPersona character={character} />
            ))}
          </Stack>
          <Stack
            styles={{
              root: { width: "45%", overflowY: "auto" },
            }}
            tokens={{ childrenGap: 10 }}
          >
            {sessions.map((session) => (
              <p>{session.name}</p>
            ))}
          </Stack>
        </Stack>
      </Stack>
      <CharacterCreationPanel
        showCharacterCreationPanel={showCharacterCreationPanel}
        toggleCharacterCreationPanel={(shouldShow) =>
          enableCharacterCreationPanel(shouldShow)
        }
      />
    </Stack>
  );
};

export default App;
