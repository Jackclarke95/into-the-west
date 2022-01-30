import { Dispatch } from "react";
import ICharacter from "./Interfaces/ICharacter";
import { Action } from "./Reducers";

/** Interface detailing the Default Root State */
declare module "react-redux" {
  /** Default root state */
  export interface DefaultRootState {
    characters: any[];

    sessions: any[];
  }

  // Declare dispatcher to take our root provider's action type
  export function useDispatch(): Dispatch<Action>;
}
