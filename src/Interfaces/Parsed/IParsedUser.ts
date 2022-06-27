import SessionRole from "../../Enums/SessionRole";

export default interface IParsedUser {
  id: string;
  name: string;
  isDungeonMaster: boolean;
  isGamesMaster: boolean;
  discordTag: string;
  availableDates: Date[];
  attendedSessions: {
    id: string;
    name: string;
    date: Date;
    role: SessionRole;
  }[];
  characterLevel: number;
  xp: number;
}
