import { Dispatch } from "react";
import ICharacter from "./Interfaces/ICharacter";
import ISession from "./Interfaces/ISession";
import ISessionData from "./Interfaces/ISessionData";
import { Action } from "./Reducers";

/** Interface detailing the Default Root State */
declare module "react-redux" {
  /** Default root state */
  export interface DefaultRootState {
    characters: ICharacter[];

    sessions: ISession[];

    // Whether to show the New Session Panel
    showNewSessionPanel: boolean;

    // Whether to show the New Character Panel
    showNewCharacterPanel: boolean;

    // Whether the application is in Dark Mode
    darkMode: boolean;

    sessionToCreate: ISessionData | null;
  }

  // Declare dispatcher to take our root provider's action type
  export function useDispatch(): Dispatch<Action>;
}
