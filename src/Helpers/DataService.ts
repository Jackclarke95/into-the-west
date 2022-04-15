import { useSelector } from "react-redux";
import { getId } from "@fluentui/react";
import { getDatabase, push, ref, set } from "firebase/database";

import { db } from "../App";
import ICharacterData from "../Interfaces/ICharacterData";

export default class DataService {
  public static createCharacter = (character: ICharacterData) => {
    const charactersRef = ref(db, "characters");

    let characterToCreate = {
      id: getId("character-"),
      avatarUrl: "",
      sheetUrl: "",
      playerDndBeyondName: character.playerDndBeyondName,
      name: character.name,
      race: character.race,
      classes: character.classes,
      currentLevel: character.currentLevel,
      sessionsAttended: 0,
      startingLevel: character.startingLevel,
    };

    character.nickname &&
      Object.defineProperty(characterToCreate, "nickname", {
        value: character.nickname,
      });

    character.subrace &&
      Object.defineProperty(characterToCreate, "subrace", {
        value: character.subrace,
      });

    push(charactersRef, characterToCreate);
  };

  public static createSession = (
    name: string,
    dungeonMaster: string,
    map: string,
    date: string,
    attendees: number[]
  ) => {
    const sessionsRef = ref(db, "sessions/");

    const sessionToCreate = {
      id: getId("session-"),
      name,
      dungeonMaster,
      map,
      date,
      attendees,
    };

    push(sessionsRef, sessionToCreate);
  };
}
