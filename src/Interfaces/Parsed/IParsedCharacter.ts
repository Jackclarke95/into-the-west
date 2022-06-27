import IParsedClass from "./IParsedClass";
import { IParsedRace } from "./IParsedRace";
import IParsedUser from "./IParsedUser";

export default interface IParsedCharacter {
  id: string;
  user: IParsedUser;
  name: string;
  nickname: string | undefined;
  classes: IParsedClass[];
  race: IParsedRace;
  startingLevel: number;
  currentLevel: number;
  avatarUrl: string;
  sheetUrl: string;
  retirement:
    | { isRetired: true }
    | { isRetired: false; reason: string; date: Date; level: number };
}
