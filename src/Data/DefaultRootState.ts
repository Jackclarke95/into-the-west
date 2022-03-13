import { Dispatch } from "react";
import { Action } from "./Reducers";

/** Interface detailing the Default Root State */
declare module "react-redux" {
  /** Default root state */
  export interface DefaultRootState {
    // Whether to show the New Session Panel
    showNewSessionPanel: boolean;

    // Whether to show the New Character Panel
    showNewCharacterPanel: boolean;

    // Whether the application is in Dark Mode
    darkMode: boolean;

    currentUser: {
      friendlyName: string;
      discordName: string;
      dndBeyondName: string;
      isDungeonMaster?: true;
      isGamesMaster?: true;
    };
  }

  // Declare dispatcher to take our root provider's action type
  export function useDispatch(): Dispatch<Action>;
}
