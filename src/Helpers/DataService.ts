import ICharacterData from "../Interfaces/ICharacterData";
import ISessionData from "../Interfaces/ISessionData";

export default class DataService {
  public static createCharacter = (character: ICharacterData) => {
    console.log("creating character", character);
  };

  public static createSession = (session: ISessionData) => {
    console.log("creating session", session);
  };
}
