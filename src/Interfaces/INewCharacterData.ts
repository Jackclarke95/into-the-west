import ICharacterClass from "./ICharacterClass";
import IRetirement from "./IRetirement";

export default interface INewCharacterData {
  id: number;
  playerDndBeyondName: string;
  name: string;
  nickname: string | null;
  race: string;
  subrace: string | null;
  classes: ICharacterClass[];
  currentLevel: number;
  sessionsAttended: number;
  retirement: IRetirement | null;
  startingLevel: number;
}
