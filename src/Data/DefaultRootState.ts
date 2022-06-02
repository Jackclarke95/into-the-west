import { User } from "firebase/auth";
import { Dispatch } from "react";
import ICharacter from "../Interfaces/ICharacter";
import IUser from "../Interfaces/IUser";
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

    users: { isLoading: true } | { isLoading: false; data: IUser[] };

    currentUser:
      | { isLoading: true }
      | { isLoading: false; data: IUser | undefined };

    classes: { isLoading: true } | { isLoading: false; data: any };

    subclasses: { isLoading: true } | { isLoading: false; data: any };

    classConfigs: { isLoading: true } | { isLoading: false; data: any };

    races: { isLoading: true } | { isLoading: false; data: any };

    subraces: { isLoading: true } | { isLoading: false; data: any };

    raceConfigs: { isLoading: true } | { isLoading: false; data: any };

    events: { isLoading: true } | { isLoading: false; data: any };

    eventInterests: { isLoading: true } | { isLoading: false; data: any };

    availabilities: { isLoading: true } | { isLoading: false; data: any };

    showCharacterCreationDialog: boolean;

    showSessionCreationDialog: boolean;

    showCharacterRetirementDialog: boolean;

    showRegistrationDialog: boolean;

    showSessionManagementDialog: boolean;

    showAccountNameManagementDialog: boolean;

    showPasswordManagementDialog: boolean;

    showCharacterManagementDialog: boolean;

    showTokenCreatorDialog: boolean;

    showNewRaceDialog: boolean;

    showNewSubraceDialog: boolean;

    isDevMode: boolean;

    authUser: User | null;
  }

  // Declare dispatcher to take our root provider's action type
  export function useDispatch(): Dispatch<Action>;
}
