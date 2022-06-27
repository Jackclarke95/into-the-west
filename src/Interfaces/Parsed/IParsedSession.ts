import IParsedCharacter from "./IParsedCharacter";
import IParsedUser from "./IParsedUser";

export default interface IParsedSession {
  id: string;
  name: string;
  characters: IParsedCharacter[];
  dungeonMaster: IParsedUser | undefined;
}
