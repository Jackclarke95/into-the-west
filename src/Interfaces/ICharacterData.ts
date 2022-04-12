export default interface ICharacterData {
  id: number;
  key?: string;
  avatarUrl: string;
  sheetUrl: string | undefined;
  playerDndBeyondName: string;
  name: string;
  nickname: string | undefined;
  race: string;
  subrace: string | undefined;
  classes: {
    class: {
      name: string;
      archetype?: string | undefined;
    };
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
