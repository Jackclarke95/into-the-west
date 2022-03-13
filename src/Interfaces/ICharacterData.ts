import ICharacterClass from "./ICharacterClass";

export default interface ICharacterData {
  id: number;
  avatarUrl: string;
  playerDndBeyondName: string;
  name: string;
  nickname: string | undefined;
  race: string;
  subrace: string | undefined;
  classes: ICharacterClass[];
  currentLevel: number;
  sessionsAttended: number;
  startingLevel: number;
  retirement: {
    reason: string;
    date: string;
  };
}
