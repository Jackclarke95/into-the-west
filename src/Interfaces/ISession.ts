import ICharacter from "./ICharacter";

/** Interface representing a Campaign Session */
export default interface ISession {
    /** Key of the Session in the Firebase Realtime Database */
  databaseKey: string | null;

  /** List of Characters that attended a Session */
  characterIds: number[];

  /** The name of the Dungeon Master of the Session */
  dungeonMaster: string;

  /** The Identifier of the Session */
  id: number;

  /** The name of the Session */
  name: string;

  /** The date on which the Session took place */
  date: Date;
}
