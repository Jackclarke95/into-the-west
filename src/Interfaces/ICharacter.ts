export default interface ICharacter {
  key: string;
  avatarUrl: string | undefined;
  sheetUrl: string | undefined;
  playerDndBeyondName: string;
  name: string;
  nickname: string | undefined;
  race: {
    race: string;
    subrace: string | undefined;
  };
  classes: {
    name: string;
    archetype: string | undefined;
    level: number;
  }[];
  currentLevel: number;
  startingLevel: number;
  sessionsAttended: number;
  retirement:
    | {
        reason: string;
        date: Date;
      }
    | undefined;
}
