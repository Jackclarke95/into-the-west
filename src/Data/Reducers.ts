import produce, { Draft } from "immer";
import { Reducer } from "react";
import { DefaultRootState } from "react-redux";

/** Description of all the Actions taken that can affect the state */
export type Action =
  | {
      type: "SetShowNewSessionPanel";
      showNewSessionPanel: DefaultRootState["showNewSessionPanel"];
    }
  | {
      type: "SetShowNewCharacterPanel";
      showNewCharacterPanel: DefaultRootState["showNewCharacterPanel"];
    }
  | { type: "SetDarkMode"; darkMode: DefaultRootState["darkMode"] }
  | { type: "SetCurrentUser"; currentUser: DefaultRootState["currentUser"] }
  | { type: "SetCharacters"; characters: DefaultRootState["characters"] }
  | { type: "SetSessions"; sessions: DefaultRootState["sessions"] }
  | { type: "SetPlayers"; players: DefaultRootState["players"] };

/** Initial application state */
export const initialState: DefaultRootState = {
  showNewSessionPanel: false,

  showNewCharacterPanel: false,

  darkMode:
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches,

  currentUser: {
    friendlyName: "Jack",
    discordName: "Jimbob_#5733",
    dndBeyondName: "JackClarke",
    isDungeonMaster: true,
    isGamesMaster: true,
  },

  characters: { isLoading: true },

  sessions: { isLoading: true },

  players: { isLoading: true },
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
        // Action for toggling the New Session Panel
        case "SetShowNewSessionPanel": {
          draftState.showNewSessionPanel = action.showNewSessionPanel;
          break;
        }

        // Action for toggling the New Character Panel
        case "SetShowNewCharacterPanel": {
          draftState.showNewCharacterPanel = action.showNewCharacterPanel;
          break;
        }

        // Action for toggling Dark Mode
        case "SetDarkMode": {
          draftState.darkMode = action.darkMode;
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

        // Action for setting the Sessions
        case "SetSessions": {
          draftState.sessions = action.sessions;
          break;
        }

        // Action for setting the Players
        case "SetPlayers": {
          draftState.players = action.players;
          break;
        }
      }
    }
  );
