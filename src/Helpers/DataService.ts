import ICharacterData from "../Interfaces/ICharacterData";
import ISessionData from "../Interfaces/ISessionData";

export const createCharacter = (character: ICharacterData) => {
  console.log("creating character", character);
};

export const createSession = (session: ISessionData) => {
  console.log("creating session", session);
};
