import { Dispatch } from "react";
import ICharacter from "./Interfaces/ICharacter";
import ISessionD from "./Interfaces/ISession";
import { Action } from "./Reducers";

/** Interface detailing the Default Root State */
declare module "react-redux" {
  /** Default root state */
  export interface DefaultRootState {
    characters: ICharacter[];

    sessions: ISessionD[];

    // Whether to show the New Session Panel
    showNewSessionPanel: boolean;

    // Whether to show the New Character Panel
    showNewCharacterPanel: boolean;

    // Whether the application is in Dark Mode
    darkMode: boolean;
  }

  // Declare dispatcher to take our root provider's action type
  export function useDispatch(): Dispatch<Action>;
}
