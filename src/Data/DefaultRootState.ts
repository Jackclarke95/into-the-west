import { User } from "firebase/auth";
import { Dispatch } from "react";
import ICharacterData from "../Interfaces/ICharacterData";
import IPlayerData from "../Interfaces/IPlayerData";
import ISessionData from "../Interfaces/ISessionData";
import { Action } from "./Reducers";

/** Interface detailing the Default Root State */
declare module "react-redux" {
  /** Default root state */
  export interface DefaultRootState {
    // Whether the application is in Dark Mode
    darkMode: boolean;

    characters:
      | { isLoading: true }
      | { isLoading: false; data: ICharacterData[] };

    activeCharacter:
      | { isLoading: true }
      | { isLoading: false; data: ICharacterData | undefined };

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

    showCharacterRetirementDialog: boolean;

    showRegistrationDialog: boolean;

    isDevMode: boolean;

    user: User | null;
  }

  // Declare dispatcher to take our root provider's action type
  export function useDispatch(): Dispatch<Action>;
}
