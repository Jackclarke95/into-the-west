import { User } from "firebase/auth";
import { Dispatch } from "react";
import { Action } from "./Reducers";
import { Character, Map, Player, Session } from "../Types/LocalStructures";
import {
  CharacterClassData,
  CharacterData,
  CharacterRaceData,
  ClassConfigData,
  ClassData,
  SessionData,
  SessionInterestData,
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

    players: { isLoading: true } | { isLoading: false; data: Player[] };

    characters: { isLoading: true } | { isLoading: false; data: Character[] };

    activeCharacter:
      | { isLoading: true }
      | { isLoading: false; data: Character | undefined };

    sessions: { isLoading: true } | { isLoading: false; data: Session[] };

    maps: { isLoading: true } | { isLoading: false; data: Map[] };

    /** The Characters stored in the Firebase Realtime Database */
    databaseCharacters:
      | { isLoading: true }
      | { isLoading: false; data: CharacterData[] };

    characterClasses:
      | { isLoading: true }
      | { isLoading: false; data: CharacterClassData[] };

    characterRaces:
      | { isLoading: true }
      | { isLoading: false; data: CharacterRaceData[] };

    /** The Maps stored in the Firebase Realtime Database */
    databaseMaps: { isLoading: true } | { isLoading: false; data: MapData[] };

    /** The Players stored in the Firebase Realtime Database */
    databasePlayers: { isLoading: true } | { isLoading: false; data: Player[] };

    /** The currently logged-in Player from the Firebase Realtime Database */
    currentPlayer:
      | { isLoading: true }
      | { isLoading: false; data: Player | undefined };

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

    /** The Sessions stored in the Firebase Realtime Database */
    databaseSessions:
      | { isLoading: true }
      | { isLoading: false; data: SessionData[] };

    /** The session Interests stored in the Firebase Realtime Database */
    sessionInterests:
      | { isLoading: true }
      | { isLoading: false; data: SessionInterestData[] };

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
      | { isShown: true; session: Session };

    /** Whether the Session Management dialog should be shown, along with which Session it will be shown for */
    sessionManagement: { isShown: false } | { isShown: true; session: Session };
  }

  // Declare dispatcher to take our root provider's action type
  export function useDispatch(): Dispatch<Action>;
}
