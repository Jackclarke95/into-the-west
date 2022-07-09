import SessionRole from "../Enums/SessionRole";

export type ClassData = {
  key: string;
  name: string;
  levelFrom: number;
  archetypeName: string;
  archetypePluralName: string;
};

export type SubclassData = {
  key: string;
  subclassName: string;
};

export type ClassConfigData = {
  key: string;
  classId: string;
  subclassId: string;
};

export type CharacterClassData = {
  key: string;
  characterId: string;
  classConfigId: string;
  level: number;
};

export type RaceData = {
  key: string;
  name: string;
  subraceRequired: boolean;
};

export type SubraceData = {
  key: string;
  name: string;
};

export type RaceConfigData = {
  key: string;
  raceId: string;
  subraceId: string;
};

export type CharacterRaceData = {
  key: string;
  characterId: string;
  raceConfigId: string;
};

export type EventData = {
  key: string;
  mapid: string;
  title: string;
  selectedDate: number | undefined;
};

export type EventInterestData = {
  key: string;
  eventId: string;
  playerId: string;
  didAttend: boolean | undefined;
  role: SessionRole;
};

export type MapData = {
  key: string;
  name: string;
};

export type UserData = {
  key: string;
  name: string;
  isDungeonMaster: boolean;
  isGamesMaster: boolean;
  discordTag: string;
  availableDates: number[];
};

export type CharacterData = {
  key: string;
  playerId: string;
  fullName: string;
  nickname: string | undefined;
  avatarUrl: string;
  sheetUrl: string;
  startingLevel: number;
  retirement: {
    reason: string;
    date: number;
    level: number;
  };
};
