import produce, { Draft } from "immer";
import { Reducer } from "react";
import { DefaultRootState } from "react-redux";

/** Description of all the Actions taken that can affect the state */
export type Action =
  | {
      type: "SetCharacters";
      characters: DefaultRootState["characters"];
    }
  | {
      type: "SetSessions";
      sessions: DefaultRootState["sessions"];
    }
  | {
      type: "SetPlayers";
      players: DefaultRootState["players"];
    }
  | {
      type: "SetCurrentPlayer";
      currentPlayer: DefaultRootState["currentPlayer"];
    }
  | {
      type: "SetActiveCharacter";
      activeCharacter: DefaultRootState["activeCharacter"];
    }
  | { type: "SetDarkMode"; darkMode: DefaultRootState["darkMode"] }
  | {
      type: "SetDatabaseCharacters";
      databaseCharacters: DefaultRootState["databaseCharacters"];
    }
  | {
      type: "SetCharacterClasses";
      characterClasses: DefaultRootState["characterClasses"];
    }
  | {
      type: "SetCharacterRaces";
      characterRaces: DefaultRootState["characterRaces"];
    }
  | {
      type: "SetActiveCharacter";
      activeCharacter: DefaultRootState["activeCharacter"];
    }
  | {
      type: "SetDatabasePlayers";
      databasePlayers: DefaultRootState["databasePlayers"];
    }
  | {
      type: "SetCurrentPlayer";
      currentPlayer: DefaultRootState["currentPlayer"];
    }
  | { type: "SetClasses"; classes: DefaultRootState["classes"] }
  | { type: "SetSubclasses"; subclasses: DefaultRootState["subclasses"] }
  | { type: "SetClassConfigs"; classConfigs: DefaultRootState["classConfigs"] }
  | { type: "SetRaces"; races: DefaultRootState["races"] }
  | { type: "SetSubraces"; subraces: DefaultRootState["subraces"] }
  | { type: "SetRaceConfigs"; raceConfigs: DefaultRootState["raceConfigs"] }
  | {
      type: "SetDatabaseSessions";
      databaseSessions: DefaultRootState["databaseSessions"];
    }
  | {
      type: "SetSessionInterests";
      sessionInterests: DefaultRootState["sessionInterests"];
    }
  | {
      type: "SetSelectedDates";
      selectedDates: DefaultRootState["selectedDates"];
    }
  | {
      type: "SetAuthUser";
      authUser: DefaultRootState["authUser"];
    }
  | {
      type: "SetShowCharacterCreationDialog";
      showCharacterCreationDialog: DefaultRootState["showCharacterCreationDialog"];
    }
  | {
      type: "SetShowSessionCreationDialog";
      showSessionCreationDialog: DefaultRootState["showSessionCreationDialog"];
    }
  | {
      type: "SetShowCharacterRetirementDialog";
      showCharacterRetirementDialog: DefaultRootState["showCharacterRetirementDialog"];
    }
  | {
      type: "SetShowRegistrationDialog";
      showRegistrationDialog: DefaultRootState["showRegistrationDialog"];
    }
  | {
      type: "SetShowAccountNameManagementDialog";
      showAccountNameManagementDialog: DefaultRootState["showAccountNameManagementDialog"];
    }
  | {
      type: "SetShowPasswordManagementDialog";
      showPasswordManagementDialog: DefaultRootState["showPasswordManagementDialog"];
    }
  | {
      type: "SetShowCharacterManagementDialog";
      showCharacterManagementDialog: DefaultRootState["showCharacterManagementDialog"];
    }
  | {
      type: "SetShowNewRaceDialog";
      showNewRaceDialog: DefaultRootState["showNewRaceDialog"];
    }
  | {
      type: "SetShowNewSubraceDialog";
      showNewSubraceDialog: DefaultRootState["showNewSubraceDialog"];
    }
  | {
      type: "SetSessionRegistration";
      sessionRegistration: DefaultRootState["sessionRegistration"];
    }
  | {
      type: "SetSessionManagement";
      sessionManagement: DefaultRootState["sessionManagement"];
    }
  | {
      type: "SetSessionCompletion";
      sessionCompletion: DefaultRootState["sessionCompletion"];
    }
  | {
      type: "SetConfirmation";
      confirmation: DefaultRootState["confirmation"];
    }
  | {
      type: "SetMaps";
      maps: DefaultRootState["maps"];
    }
  | {
      type: "SetDatabaseMaps";
      databaseMaps: DefaultRootState["databaseMaps"];
    };

/** Initial application state */
export const initialState: DefaultRootState = {
  players: { isLoading: true },

  currentPlayer: { isLoading: true },

  characters: { isLoading: true },

  activeCharacter: { isLoading: true },

  sessions: { isLoading: true },

  maps: { isLoading: true },

  databaseCharacters: { isLoading: true },

  characterClasses: { isLoading: true },

  characterRaces: { isLoading: true },

  databaseMaps: { isLoading: true },

  databasePlayers: { isLoading: true },

  databaseSessions: { isLoading: true },

  classes: { isLoading: true },

  subclasses: { isLoading: true },

  classConfigs: { isLoading: true },

  races: { isLoading: true },

  subraces: { isLoading: true },

  raceConfigs: { isLoading: true },

  sessionInterests: { isLoading: true },

  selectedDates: [] as number[],

  darkMode:
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches,

  isDevMode: window.location.hostname === "localhost",

  authUser: null,

  showCharacterCreationDialog: false,

  showSessionCreationDialog: false,

  showCharacterRetirementDialog: false,

  showRegistrationDialog: false,

  showAccountNameManagementDialog: false,

  showPasswordManagementDialog: false,

  showCharacterManagementDialog: false,

  showNewRaceDialog: false,

  showNewSubraceDialog: false,

  sessionRegistration: { isShown: false },

  sessionManagement: { isShown: false },

  sessionCompletion: { isShown: false },

  confirmation: { isShown: false },
};

/**
 * Updates the App state from the actions
 * @param currentState - The current state of the App
 * @param action - The action to update the state
 */
export const rootReducer: Reducer<DefaultRootState, Action> = (
  currentState,
  action
): DefaultRootState =>
  produce<DefaultRootState, Draft<DefaultRootState>, void>(
    currentState,
    (draftState) => {
      switch (action.type) {
        // Action for setting the parsed characters
        case "SetCharacters": {
          draftState.characters = action.characters;
          break;
        }

        // Action for setting the parsed sessions
        case "SetSessions": {
          draftState.sessions = action.sessions;
          break;
        }

        // Action for toggling Dark Mode
        case "SetDarkMode": {
          draftState.darkMode = action.darkMode;
          break;
        }

        // Action for setting the Logged-in User
        case "SetAuthUser": {
          draftState.authUser = action.authUser;
          break;
        }

        // Action for setting the Current User
        case "SetCurrentPlayer": {
          draftState.currentPlayer = action.currentPlayer;
          break;
        }

        // Action for setting the Characters
        case "SetDatabaseCharacters": {
          draftState.databaseCharacters = action.databaseCharacters;
          break;
        }

        // Action for setting the New Characters
        case "SetCharacterClasses": {
          draftState.characterClasses = action.characterClasses;
          break;
        }
        // Action for setting the New Characters
        case "SetCharacterRaces": {
          draftState.characterRaces = action.characterRaces;
          break;
        }

        // Action for setting the Maps
        case "SetDatabaseMaps": {
          draftState.databaseMaps = action.databaseMaps;
          break;
        }

        // Action for setting the Parsed Maps
        case "SetMaps": {
          draftState.maps = action.maps;
          break;
        }

        // Action for setting the Active Character
        case "SetActiveCharacter": {
          draftState.activeCharacter = action.activeCharacter;
          break;
        }

        // Action for setting the Players
        case "SetDatabasePlayers": {
          draftState.databasePlayers = action.databasePlayers;
          break;
        }

        // Action for setting the Players
        case "SetPlayers": {
          draftState.players = action.players;
          break;
        }

        // Action for setting the Classes
        case "SetClasses": {
          draftState.classes = action.classes;
          break;
        }

        // Action for setting the Subclasses
        case "SetSubclasses": {
          draftState.subclasses = action.subclasses;
          break;
        }

        // Action for setting the Class Configurations
        case "SetClassConfigs": {
          draftState.classConfigs = action.classConfigs;
          break;
        }

        // Action for setting the Races
        case "SetRaces": {
          draftState.races = action.races;
          break;
        }

        // Action for setting the Subraces
        case "SetSubraces": {
          draftState.subraces = action.subraces;
          break;
        }

        // Action for setting the Race Configurations
        case "SetRaceConfigs": {
          draftState.raceConfigs = action.raceConfigs;
          break;
        }

        // Action for setting the Sessions
        case "SetDatabaseSessions": {
          draftState.databaseSessions = action.databaseSessions;
          break;
        }

        // Action for setting the Session Interests
        case "SetSessionInterests": {
          draftState.sessionInterests = action.sessionInterests;
          break;
        }

        // Action for setting the Availability Selections
        case "SetSelectedDates": {
          draftState.selectedDates = action.selectedDates;
          break;
        }

        // Action for toggling the Character Creation Dialog
        case "SetShowCharacterCreationDialog": {
          draftState.showCharacterCreationDialog =
            action.showCharacterCreationDialog;
          break;
        }

        // Action for toggling the Session Creation Dialog
        case "SetShowSessionCreationDialog": {
          draftState.showSessionCreationDialog =
            action.showSessionCreationDialog;
          break;
        }

        // Action for toggling the Character Retirement Dialog
        case "SetShowCharacterRetirementDialog": {
          draftState.showCharacterRetirementDialog =
            action.showCharacterRetirementDialog;
          break;
        }

        // Action for toggling the Registration Dialog
        case "SetShowRegistrationDialog": {
          draftState.showRegistrationDialog = action.showRegistrationDialog;
          break;
        }

        // Action for toggling the Account Name Management Dialog
        case "SetShowAccountNameManagementDialog": {
          draftState.showAccountNameManagementDialog =
            action.showAccountNameManagementDialog;
          break;
        }

        // Action for toggling the Password Management Dialog
        case "SetShowPasswordManagementDialog": {
          draftState.showPasswordManagementDialog =
            action.showPasswordManagementDialog;

          break;
        }

        // Action for toggling the Character Management Dialog
        case "SetShowCharacterManagementDialog": {
          draftState.showCharacterManagementDialog =
            action.showCharacterManagementDialog;
          break;
        }

        // Action for toggling the New Race Dialog
        case "SetShowNewRaceDialog": {
          draftState.showNewRaceDialog = action.showNewRaceDialog;
          break;
        }

        // Action for toggling the New Sub Race Dialog
        case "SetShowNewSubraceDialog": {
          draftState.showNewSubraceDialog = action.showNewSubraceDialog;
          break;
        }

        // Action for toggling the Session Registration Dialog and the relevant session
        case "SetSessionRegistration": {
          draftState.sessionRegistration = action.sessionRegistration;
          break;
        }

        // Action for toggling the Session Management Dialog and the relevant session
        case "SetSessionManagement": {
          draftState.sessionManagement = action.sessionManagement;
          break;
        }

        // Action for toggling the Session Management Dialog and the relevant session
        case "SetSessionCompletion": {
          draftState.sessionCompletion = action.sessionCompletion;
          break;
        }

        // Action for toggling the Confirmation Dialog
        case "SetConfirmation": {
          draftState.confirmation = action.confirmation;
          break;
        }
      }
    }
  );
