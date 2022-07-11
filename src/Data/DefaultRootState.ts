import { User } from "firebase/auth";
import { Dispatch } from "react";
import ICharacter from "../Interfaces/ICharacter";
import IPlayer from "../Interfaces/IUser";
import ISession from "../Interfaces/ISession";
import { Action } from "./Reducers";
import { Character, Map, Player, Session } from "../Types/LocalStructures";
import {
  CharacterClassData,
  CharacterData,
  CharacterRaceData,
  ClassConfigData,
  ClassData,
  EventData,
  EventInterestData,
  MapData,
  RaceConfigData,
  RaceData,
  SubclassData,
  SubraceData,
} from "../Types/DatabaseStructures";

/** Interface detailing the Default Root State */
declare module "react-redux" {
  /** Default root state */
  export interface DefaultRootState {
    /** Whether the application is in Dark Mode */
    darkMode: boolean;

    /** Whether the application is in Developer Mode */
    isDevMode: boolean;

    /** The currently logged-in User as a Firebase User */
    authUser: User | null;

    parsedPlayers: { isLoading: true } | { isLoading: false; data: Player[] };

    currentParsedPlayer:
      | { isLoading: true }
      | { isLoading: false; data: Player | undefined };

    parsedCharacters:
      | { isLoading: true }
      | { isLoading: false; data: Character[] };

    activeParsedCharacter:
      | { isLoading: true }
      | { isLoading: false; data: Character | undefined };

    parsedSessions: { isLoading: true } | { isLoading: false; data: Session[] };

    parsedMaps: { isLoading: true } | { isLoading: false; data: Map[] };

    /** The Characters stored in the Firebase Realtime Database */
    characters: { isLoading: true } | { isLoading: false; data: ICharacter[] };

    /** The Characters stored in the Firebase Realtime Database, in the new format */
    newCharacters:
      | { isLoading: true }
      | { isLoading: false; data: CharacterData[] };

    characterClasses:
      | { isLoading: true }
      | { isLoading: false; data: CharacterClassData[] };

    characterRaces:
      | { isLoading: true }
      | { isLoading: false; data: CharacterRaceData[] };

    /** The Maps stored in the Firebase Realtime Database */
    maps: { isLoading: true } | { isLoading: false; data: MapData[] };

    /** The currently logged-in player's Active Character from the Firebase Realtime Database */
    activeCharacter:
      | { isLoading: true }
      | { isLoading: false; data: ICharacter | undefined };

    /** The Sessions stored in the Firebase Realtime Database */
    sessions: { isLoading: true } | { isLoading: false; data: ISession[] };

    /** The Players stored in the Firebase Realtime Database */
    players: { isLoading: true } | { isLoading: false; data: IPlayer[] };

    /** The currently logged-in Player from the Firebase Realtime Database */
    currentPlayer:
      | { isLoading: true }
      | { isLoading: false; data: IPlayer | undefined };

    /** The Classes stored in the Firebase Realtime Database */
    classes: { isLoading: true } | { isLoading: false; data: ClassData[] };

    /** The Subclasses stored in the Firebase Realtime Database */
    subclasses:
      | { isLoading: true }
      | { isLoading: false; data: SubclassData[] };

    /** The Class Configurations stored in the Firebase Realtime Database */
    classConfigs:
      | { isLoading: true }
      | { isLoading: false; data: ClassConfigData[] };

    /** The Races stored in the Firebase Realtime Database */
    races: { isLoading: true } | { isLoading: false; data: RaceData[] };

    /** The Subraces stored in the Firebase Realtime Database */
    subraces: { isLoading: true } | { isLoading: false; data: SubraceData[] };

    /** The Race Configurations stored in the Firebase Realtime Database */
    raceConfigs:
      | { isLoading: true }
      | { isLoading: false; data: RaceConfigData[] };

    /** The Events stored in the Firebase Realtime Database */
    events: { isLoading: true } | { isLoading: false; data: EventData[] };

    /** The Event Interests stored in the Firebase Realtime Database */
    eventInterests:
      | { isLoading: true }
      | { isLoading: false; data: EventInterestData[] };

    /** The current player's Available Dates as a selection in the UI */
    selectedDates: number[];

    /** Whether to show the Character Creation Dialog */
    showCharacterCreationDialog: boolean;

    /** Whether to show the Session Creation Dialog */
    showSessionCreationDialog: boolean;

    /** Whether to show the Character Retirement Dialog */
    showCharacterRetirementDialog: boolean;

    /** Whether to show the Registration Dialog */
    showRegistrationDialog: boolean;

    /** Whether to show the Account Name Management Dialog */
    showAccountNameManagementDialog: boolean;

    /** Whether to show the Password Management Dialog */
    showPasswordManagementDialog: boolean;

    /** Whether to show the Character Creation Dialog */
    showCharacterManagementDialog: boolean;

    /** Whether to show the Token Creator Dialog */
    showTokenCreatorDialog: boolean;

    /** Whether to show the New Race Dialog */
    showNewRaceDialog: boolean;

    /** Whether to show the New Subrace Dialog */
    showNewSubraceDialog: boolean;

    /** Whether the Session Registration dialog should be shown, along with which Session it will be shown for */
    sessionRegistration:
      | { isShown: false }
      | { isShown: true; session: ISession };

    /** Whether the Session Management dialog should be shown, along with which Session it will be shown for */
    sessionManagement: { isShown: false } | { isShown: true; session: Session };
  }

  // Declare dispatcher to take our root provider's action type
  export function useDispatch(): Dispatch<Action>;
}
