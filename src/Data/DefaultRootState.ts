import { User } from "firebase/auth";
import { Dispatch } from "react";
import ICharacter from "../Interfaces/ICharacter";
import IPlayer from "../Interfaces/IPlayer";
import ISession from "../Interfaces/ISession";
import { Action } from "./Reducers";

/** Interface detailing the Default Root State */
declare module "react-redux" {
  /** Default root state */
  export interface DefaultRootState {
    // Whether the application is in Dark Mode
    darkMode: boolean;

    characters: { isLoading: true } | { isLoading: false; data: ICharacter[] };

    activeCharacter:
      | { isLoading: true }
      | { isLoading: false; data: ICharacter | undefined };

    sessions: { isLoading: true } | { isLoading: false; data: ISession[] };

    players: { isLoading: true } | { isLoading: false; data: IPlayer[] };

    currentPlayer:
      | { isLoading: true }
      | { isLoading: false; data: IPlayer | undefined };

    showCharacterCreationDialog: boolean;

    showSessionCreationDialog: boolean;

    showCharacterRetirementDialog: boolean;

    showRegistrationDialog: boolean;

    showSessionManagementDialog: boolean;

    showAccountNameManagementDialog: boolean;

    showPasswordManagementDialog: boolean;

    showCharacterManagementDialog: boolean;

    isDevMode: boolean;

    user: User | null;
  }

  // Declare dispatcher to take our root provider's action type
  export function useDispatch(): Dispatch<Action>;
}
