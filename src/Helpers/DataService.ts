import ICharacterData from "../Interfaces/ICharacterData";
import ISessionData from "../Interfaces/ISessionData";

import { getDatabase, ref, set } from "firebase/database";
import { db } from "../App";

export default class DataService {
  public static createCharacter = (character: ICharacterData) => {
    console.log("creating character", character);

    console.log(db);

    set(ref(db, "test/"), {
      id: character.id,
      avatarUrl: "",
      sheetUrl: "",
      playerDndBeyondName: "JackClarke",
      name: character.name,
      nickname: character.nickname,
      race: character.race,
      subrace: undefined,
      classes: character.classes,
      currentLevel: character.currentLevel,
      sessionsAttended: 0,
      startingLevel: character.currentLevel,
    });
  };

  public static createSession = (session: ISessionData) => {
    console.log("creating session", session);
  };
}
