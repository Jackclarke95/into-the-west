export default interface ISession {
  key: string;
  name: string;
  dungeonMaster: string;
  map: string;
  date: Date | undefined;
  attendees: string[];
}
