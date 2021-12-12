import ICharacterClass from "./ICharacterClass";

/** Interface representing a D&D Character */
export default interface ICharacter {
  /** Key of the Character in the Firebase Realtime Database */
  databaseKey: string | null;

  /** The Identifier of the Character */
  id: number;

  /** The Classes of the Character */
  classes: ICharacterClass[];

  /** The name of the Character */
  name: string;

  /** The nickname of the Character (optional) */
  nickname: string | null;

  /** The D&D Beyond username of the Character's Player */
  playerDndBeyondName: string;

  /** The name of the Race of the Character */
  race: string;

  /** The name of the Subrace of the Character (optional) */
  subrace: string | null;

  /** Whether the Character is retired; including a date and a reason if they are retired */
  retirement: { cause: string; date: Date } | null;

  /** The level at which the Character started the Campaign */
  startingLevel: number;

  /** The initials of the Character's name */
  initials: string;

  /** The ordinal format of the Character's level (1st, 3rd, 8th, etc) */
  ordinalLevel: string;

  /** The maximum sessions required for the Character reach the next level, assuming  no session progress */
  maxSessionsToNextLevel: number;

  /** The total number of Sessions attending by the Character */
  sessionCount: number;

  /** The Character's level */
  level: number;

  /** Sessions until the Character will gain a level */
  sessionToLevelUp: number;

  imageUrl?: string;
}
