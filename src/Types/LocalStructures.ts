export type Class = {
  class: string;
  level: number;
  subclass: string | undefined;
};

export type Race = {
  race: string;
  subrace: string | undefined;
};

export type Character = {
  id: string;
  player: Player | undefined;
  fullName: string;
  nickname: string | undefined;
  classes: Class[];
  race: Race;
  startingLevel: number;
  currentLevel: number;
  avatarUrl: string;
  sheetUrl: string;
  retirement:
    | { isRetired: false }
    | { isRetired: true; reason: string; date: number; level: number };
};

export type Session = {
  id: string;
  name: string;
  attendees: Character[];
  dungeonMaster: Player | undefined;
  date: number | undefined;
};

export type Player = {
  id: string;
  name: string;
  isDungeonMaster: boolean;
  isGamesMaster: boolean;
  discordTag: string;
  availableDates: number[];
  characterLevel: number;
  xp: number;
  sessionsPlayed: number;
  sessionsRun: number;
};
