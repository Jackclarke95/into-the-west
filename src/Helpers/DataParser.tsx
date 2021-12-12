import ICharacter from "../Interfaces/ICharacter";
import ICharacterData from "../Interfaces/ICharacterData";
import ISession from "../Interfaces/ISession";
import ISessionData from "../Interfaces/ISessionData";

import {
  calculateSessionsForLevelUp,
  calculateLevelFromSessions,
  countSessionsAttended,
  getOrdinal,
  getMainClass,
  getMainClassColour,
  getCharacterClasses,
  calculateMaxSessionsToNextLevel,
} from "./DataHelper";

import { firestore } from "../firebase.utils";

const parseCharacterData = (
  characterData: {
    key: string | null;
    value: ICharacterData;
  }[],
  sessions: ISession[]
) => {
  const newCharacterDataArray = [] as ICharacter[];

  characterData.forEach((character) => {
    const characterClasses = getCharacterClasses(character.value.classes);
    const sessionCount = countSessionsAttended(
      character.value.id,
      sessions.map((session) => session)
    );
    const level = calculateLevelFromSessions(
      character.value["starting-level"],
      sessionCount
    );
    const ordinalLevel = getOrdinal(level);
    const maxSessionsToNextLevel = calculateMaxSessionsToNextLevel(level);
    const getCharacterInitials = () => {
      const fullInitials = character.value.nickname!
        ? character.value.name
            .split(" ")
            .map((name) => name[0])
            .join("")
        : character.value.name[0];

      if (fullInitials.length > 1) {
        return fullInitials[0] + fullInitials[fullInitials.length - 1];
      } else {
        return fullInitials;
      }
    };
    const sessionToLevelUp = calculateSessionsForLevelUp(
      character.value["starting-level"],
      sessionCount
    );

    var imageUrl = "";

    firestore
      .ref(`Avatars/${character.value.id}.jpeg`)
      .getDownloadURL()
      .then((url) => {
        imageUrl = url;
      })
      .catch(
        (e) =>
          (imageUrl =
            "https://www.dndbeyond.com/Content/Skins/Waterdeep/images/characters/default-avatar-builder.png")
      );

    newCharacterDataArray.push({
      databaseKey: character.key,
      id: character.value.id,
      classes: characterClasses,
      name: character.value.name,
      nickname: character.value.nickname,
      playerDndBeyondName: character.value["player-dndbeyond-name"],
      race: character.value.race,
      subrace: character.value.subrace,
      startingLevel: character.value["starting-level"],
      initials: getCharacterInitials(),
      ordinalLevel: ordinalLevel,
      maxSessionsToNextLevel: maxSessionsToNextLevel,
      sessionCount: sessionCount,
      level: level,
      retirement: character.value.retirement
        ? {
            cause: character.value.retirement.cause,
            date: new Date(character.value.retirement.date),
          }
        : null,
      sessionToLevelUp: sessionToLevelUp,
    });
  });

  return newCharacterDataArray;
};

const parseSessionData = (
  sessionData: { key: string | null; value: ISessionData }[]
) => {
  const newSessionDataArray = [] as ISession[];

  sessionData.forEach((session) => {
    newSessionDataArray.push({
      databaseKey: session.key,
      characterIds: session.value.characters,
      dungeonMaster: session.value["dungeon-master"],
      name: session.value.name,
      date: new Date(session.value["scheduled-date"]),
      id: session.value.id,
    });
  });

  return newSessionDataArray;
};

export { parseCharacterData, parseSessionData };
