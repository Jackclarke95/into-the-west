export default interface ISessionData {
  id: number;
  name: string;
  dungeonMaster: string;
  map:
    | "The Everwilds"
    | "The Forgotten Lands"
    | "The Lunar Isles"
    | "The Shattered Realm";
  date: string;
  attendees: number[];
}
