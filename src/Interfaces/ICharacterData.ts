export default interface ICharacterData {
  avatarUrl?: string;
  sheetUrl?: string;
  playerDndBeyondName: string;
  name: string;
  nickname: string | undefined;
  race: string;
  subrace?: string | undefined;
  classes: {
    name: string;
    archetype?: string;
    level: number;
  }[];
  currentLevel: number;
  sessionsAttended: number;
  startingLevel: number;
  retirement?: {
    reason: string;
    date: string;
  };
}
