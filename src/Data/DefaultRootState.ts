import { User } from "firebase/auth";
import { Dispatch } from "react";
import ICharacterData from "../Interfaces/ICharacterData";
import IPlayerData from "../Interfaces/IPlayerData";
import ISession from "../Interfaces/ISession";
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

    sessions: { isLoading: true } | { isLoading: false; data: ISession[] };

    players: { isLoading: true } | { isLoading: false; data: IPlayerData[] };

    currentPlayer:
      | { isLoading: true }
      | { isLoading: false; data: IPlayerData | undefined };

    showCharacterCreationDialog: boolean;

    showSessionCreationDialog: boolean;

    showCharacterRetirementDialog: boolean;

    showRegistrationDialog: boolean;

    showSessionManagementDialog: boolean;

    showAccountNameManagementDialog: boolean;

    showPasswordManagementDialog: boolean;

    isDevMode: boolean;

    user: User | null;
  }

  // Declare dispatcher to take our root provider's action type
  export function useDispatch(): Dispatch<Action>;
}
