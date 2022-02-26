export default interface ISessionData {
  characters: number[];

  id: number;

  ["dungeon-master"]: string;

  name: string;

  ["scheduled-date"]: string;

  databaseKey?: string;

  description?: string;
}
