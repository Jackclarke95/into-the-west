import ICharacterClass from "./ICharacterClass";

export default interface ICharacterData {
  classes: ICharacterClass[];
  id: number;
  name: string;
  nickname: string | null;
  race: string;
  subrace: string | null;
  retirement: {
    cause: string;
    date: string;
  } | null;
  ["starting-level"]: number;
  ["player-dndbeyond-name"]: string;
}
