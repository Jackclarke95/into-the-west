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
  currentLevel: number | undefined;
  avatarUrl: string | undefined;
  sheetUrl: string | undefined;
  retirement:
    | { isRetired: false }
    | { isRetired: true; reason: string; date: number; level: number };
};

export type Session = {
  id: string;
  name: string;
  attendees: { attending: Character[]; interested: Character[] };
  dungeonMaster: Player | undefined;
  date: number | undefined;
  map: Map;
  suggestedByPlayerId: string | undefined;
};

export type Player = {
  id: string;
  name: string;
  isDungeonMaster: boolean;
  isGamesMaster: boolean;
  availableDates: number[];
  characterLevel: number;
  xp: number;
  sessionsPlayed: number;
  sessionsRun: number;
};

export type Map = {
  id: string;
  name: string;
};
