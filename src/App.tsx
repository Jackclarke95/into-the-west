import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  Stack,
  Text,
  IStackStyles,
  ThemeProvider,
  FontSizes,
} from "@fluentui/react";
import { initializeIcons } from "@fluentui/react/lib/Icons";

import {
  parseCharacterData,
  parseSessionData,
} from "./Helpers/DataParser";
import { auth, firebaseDb } from "./firebase.utils";
import "./Style/App.scss";
import {
  darkRedTheme as darkTheme,
  lightRedTheme as lightTheme,
} from "./Style/Themes";
import ISessionData from "./Interfaces/ISessionData";
import ICharacterData from "./Interfaces/ICharacterData";
import { NewCharacterPanel } from "./Components/NewCharacterPanel";
import { Characters } from "./Components/Characters";
import { Sessions } from "./Components/Sessions";
import { Commands } from "./Components/CommandBar";
import { NewSessionPanel } from "./Components/NewSessionPanel";

export default () => {
  const dispatch = useDispatch();

  const [userAccount, setUserAccount] = useState({} as any);

  const [themeOverride, setThemeOverride] = useState(false);

  const sessions = useSelector((state) => state.sessions);
  const darkMode = useSelector((state) => state.darkMode);

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

        // Redux version
        dispatch({
          type: "SetCharacters",
          characters: data.map((character) =>
            parseCharacterData(character, sessions)
          ),
        });
      });
  }, [firebaseDb]);

  const stackStyles: Partial<IStackStyles> = {
    root: {
      width: "100%",
      margin: "0 auto",
      textAlign: "center",
      color: "#605e5c",
      display: "flex",
      flexDirection: "column",
      maxHeight: "fit-content",
    },
  };

  const getTheme = () => {
    return darkMode ||
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
        <NewSessionPanel />
        <NewCharacterPanel />
      </Stack>
    </ThemeProvider>
  );
};
