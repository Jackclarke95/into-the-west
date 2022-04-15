import { useSelector } from "react-redux";
import { getId } from "@fluentui/react";
import { getDatabase, push, ref, set } from "firebase/database";

import { db } from "../App";
import ICharacterData from "../Interfaces/ICharacterData";

export default class DataService {
  public static createCharacter = (character: ICharacterData) => {
    console.log("creating character from data:", character);
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

    console.log("character to create:", characterToCreate);

    push(charactersRef, characterToCreate);
  };

  public static createSession = (
    name: string,
    dungeonMaster: string,
    map: string,
    date: string,
    attendees: number[]
  ) => {
    console.log("creating session", {
      name,
      dungeonMaster,
      map,
      date,
      attendees,
    });
    const sessionsRef = ref(db, "sessions/");

    push(sessionsRef, {
      id: getId("session-"),
      name: name,
      dungeonMaster: dungeonMaster,
      map: map,
      date: date,
      attendees: attendees,
    });
  };
}
