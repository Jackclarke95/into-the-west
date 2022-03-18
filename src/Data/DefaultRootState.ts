import { Dispatch } from "react";
import ICharacterData from "../Interfaces/ICharacterData";
import IPlayerData from "../Interfaces/IPlayerData";
import ISessionData from "../Interfaces/ISessionData";
import { Action } from "./Reducers";

/** Interface detailing the Default Root State */
declare module "react-redux" {
  /** Default root state */
  export interface DefaultRootState {
    // Whether to show the New Session Dialog
    showNewSessionDialog: boolean;

    // Whether to show the New Character Dialog
    showNewCharacterDialog: boolean;

    // Whether the application is in Dark Mode
    darkMode: boolean;

    characters:
      | { isLoading: true }
      | { isLoading: false; data: ICharacterData[] };

    sessions: { isLoading: true } | { isLoading: false; data: ISessionData[] };

    players: { isLoading: true } | { isLoading: false; data: IPlayerData[] };

    currentUser: {
      friendlyName: string;
      discordName: string;
      dndBeyondName: string;
      isDungeonMaster?: true;
      isGamesMaster?: true;
    };

    showCharacterCreationDialog: boolean;

    showSessionCreationDialog: boolean;
  }

  // Declare dispatcher to take our root provider's action type
  export function useDispatch(): Dispatch<Action>;
}
