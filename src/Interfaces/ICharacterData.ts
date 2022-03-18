export default interface ICharacterData {
  id: number;
  key: string;
  avatarUrl: string;
  sheetUrl: string | undefined;
  playerDndBeyondName: string;
  name: string;
  nickname: string | undefined;
  race: string;
  subrace: string | undefined;
  classes: {
    name: string;
    level: number;
    archetype?: string | undefined;
  }[];
  currentLevel: number;
  sessionsAttended: number;
  startingLevel: number;
  retirement?: {
    reason: string;
    date: string;
  };
}
