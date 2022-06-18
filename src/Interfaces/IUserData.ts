export default interface IUserData {
  email: string;
  name: string;
  discordTag: string;
  dndBeyondName: string;
  isDungeonMaster: true | undefined;
  isGamesMaster: true | undefined;
  availableDates: number[];
}
