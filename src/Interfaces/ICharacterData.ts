export default interface ICharacterData {
  classes: {
    class: string;
    level: number;
  }[];
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
  ["avatar-link"]: string | null;
}
