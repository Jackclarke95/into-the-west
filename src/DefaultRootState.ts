import { Dispatch } from "react";
import ICharacter from "./Interfaces/ICharacter";
import ISessionD from "./Interfaces/ISession";
import { Action } from "./Reducers";

/** Interface detailing the Default Root State */
declare module "react-redux" {
  /** Default root state */
  export interface DefaultRootState {
    characters: ICharacter[];

    characterImages: { characterId: number; imageUrl: string }[];

    sessions: ISessionD[];
  }

  // Declare dispatcher to take our root provider's action type
  export function useDispatch(): Dispatch<Action>;
}
