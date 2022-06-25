import produce, { Draft } from "immer";
import { Reducer } from "react";
import { DefaultRootState } from "react-redux";

/** Description of all the Actions taken that can affect the state */
export type Action =
  | { type: "SetDarkMode"; darkMode: DefaultRootState["darkMode"] }
  | { type: "SetCharacters"; characters: DefaultRootState["characters"] }
  | {
      type: "SetActiveCharacter";
      activeCharacter: DefaultRootState["activeCharacter"];
    }
  | { type: "SetSessions"; sessions: DefaultRootState["sessions"] }
  | { type: "SetUsers"; users: DefaultRootState["users"] }
  | {
      type: "SetCurrentUser";
      currentUser: DefaultRootState["currentUser"];
    }
  | { type: "SetClasses"; classes: DefaultRootState["classes"] }
  | { type: "SetSubclasses"; subclasses: DefaultRootState["subclasses"] }
  | { type: "SetClassConfigs"; classConfigs: DefaultRootState["classConfigs"] }
  | { type: "SetRaces"; races: DefaultRootState["races"] }
  | { type: "SetSubraces"; subraces: DefaultRootState["subraces"] }
  | { type: "SetRaceConfigs"; raceConfigs: DefaultRootState["raceConfigs"] }
  | { type: "SetEvents"; events: DefaultRootState["events"] }
  | {
      type: "SetEventInterests";
      eventInterests: DefaultRootState["eventInterests"];
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
      type: "SetShowTokenCreatorDialog";
      showTokenCreatorDialog: DefaultRootState["showTokenCreatorDialog"];
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
    };

/** Initial application state */
export const initialState: DefaultRootState = {
  characters: { isLoading: true },

  activeCharacter: { isLoading: true },

  sessions: { isLoading: true },

  users: { isLoading: true },

  currentUser: { isLoading: true },

  classes: { isLoading: true },

  subclasses: { isLoading: true },

  classConfigs: { isLoading: true },

  races: { isLoading: true },

  subraces: { isLoading: true },

  raceConfigs: { isLoading: true },

  events: { isLoading: true },

  eventInterests: { isLoading: true },

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

  showTokenCreatorDialog: false,

  showNewRaceDialog: false,

  showNewSubraceDialog: false,

  sessionRegistration: { isShown: false },

  sessionManagement: { isShown: false },
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
        case "SetCurrentUser": {
          draftState.currentUser = action.currentUser;
          break;
        }

        // Action for setting the Characters
        case "SetCharacters": {
          draftState.characters = action.characters;
          break;
        }

        // Action for setting the Active Character
        case "SetActiveCharacter": {
          draftState.activeCharacter = action.activeCharacter;
          break;
        }

        // Action for setting the Sessions
        case "SetSessions": {
          draftState.sessions = action.sessions;
          break;
        }

        // Action for setting the Players
        case "SetUsers": {
          draftState.users = action.users;
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

        // Action for setting the Events
        case "SetEvents": {
          draftState.events = action.events;
          break;
        }

        // Action for setting the Event Interests
        case "SetEventInterests": {
          draftState.eventInterests = action.eventInterests;
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

        // Action for toggling the Token Creator Dialog
        case "SetShowTokenCreatorDialog": {
          draftState.showTokenCreatorDialog = action.showTokenCreatorDialog;
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
      }
    }
  );
