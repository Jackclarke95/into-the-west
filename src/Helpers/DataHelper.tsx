import ICharacter from "../Interfaces/ICharacter";
import ICharacterClass from "../Interfaces/ICharacterClass";
import ISession from "../Interfaces/ISession";

/**
 * Gets a number in its ordinal format. For example, passing in "27", will return "27th"
 *
 * @param {number} number The number to format
 * @return {string} The number in ordinal format
 */
const getOrdinal = (number: number) => {
  const lastDigit = number % 10;

  if (number === 11 || number === 12) {
    return number + "th";
  }

  switch (lastDigit) {
    case 1:
      return number + "st";

    case 2:
      return number + "nd";

    case 3:
      return number + "rd";

    default:
      return number + "th";
  }
};

/**
 * Determines the characters that attended specified session
 *
 * @param {*} characters All characters
 * @param {*} session The session whose attendance to calculate
 * @return {string} A list of characters that attended specified session
 */
const determineSessionCharacters = (
  characters: ICharacter[],
  session: ISession
) => {
  let sessionCharacters = [] as string[];

  Object.keys(characters).forEach((key) => {
    const character = characters[key];

    if (session.characterIds.includes(character.id)) {
      sessionCharacters.push(character.nickname ?? character.name);
    }
  });

  return sessionCharacters.sort().join(", ");
};

/**
 * Gets a the main class of a character with the most levels
 *
 * @param {*} character The character whose class to get
 * @return {string}
 */
const getMainClass = (character) => {
  const characterClasses = character.classes;

  let currentClass = character.classes[0];

  characterClasses.forEach((characterClass) => {
    if (characterClass.level > currentClass.level) {
      currentClass = characterClass;
    }
  });

  return currentClass.class;
};

/**
 * Gets a list of the character's classes, ordered by highest level first
 *
 * @param {*} character
 * @return {string[]} A list of the character's classes
 */
const getCharacterClasses = (characterClasses: ICharacterClass[]) => {
  characterClasses.sort((a, b) => {
    return b.level - a.level;
  });

  let classList = [] as ICharacterClass[];

  characterClasses.forEach((characterClass) => {
    classList.push({
      class: characterClass.class,
      level: characterClass.level,
    });
  });

  return classList;
};

/**
 * Calculates the number of sessions required for a character to gain a new level from
 * the start of the previous level
 *
 * @param {number} level The level for which to calculate the
 *
 * @returns {number} The number of sessions required for this level
 */
const calculateMaxSessionsToNextLevel = (level: number) =>
  Math.trunc(level / 6 + 2);

/**
 * Calculates the character's current level from its starting level and session count
 *
 * @param {number} startingLevel The level that at which the character was created
 * @param {number} sessionCount The total number of sessions the character has attended
 *
 * @returns {number} The character's level
 */
const calculateLevelFromSessions = (
  startingLevel: number,
  sessionCount: number
) => {
  let currentLevel = startingLevel;
  let remainingSessions = sessionCount;
  let sessionsToLevel = calculateMaxSessionsToNextLevel(currentLevel + 1);

  while (remainingSessions >= sessionsToLevel) {
    remainingSessions -= sessionsToLevel;
    currentLevel++;
    sessionsToLevel = calculateMaxSessionsToNextLevel(currentLevel + 1);
  }

  return currentLevel;
};

/**
 * Calculates the remaining number of sessions a character must attend before levelling up
 *
 * @param {number} startingLevel The level that at which the character was created
 * @param {number} sessionCount The total number of sessions the character has attended
 *
 * @returns {number} The remaining number of sessions a character must attend in order to gain a level
 */
const calculateSessionsForLevelUp = (
  startingLevel: number,
  sessionCount: number
) => {
  let currentLevel = calculateLevelFromSessions(startingLevel, sessionCount);

  let sessionsRequiredForNext = calculateOffsetSessionsRequiredForLevel(
    currentLevel + 1
  );

  let offsetCurrentSessions =
    sessionCount + calculateOffsetSessionsRequiredForLevel(startingLevel);

  return sessionsRequiredForNext - offsetCurrentSessions;
};

/**
 * Counts the number of sessions a character has attended
 *
 * @param {*} character The characters whose session attendance to count
 * @param {*} sessions All sessions
 * @return {number} The number of sessions a character has attended
 */
const countSessionsAttended = (characterId: number, sessions: ISession[]) => {
  // let matchingSessions = [] as any[];
  let sessionCount = 0;

  sessions.forEach((session) => {
    if (
      session.characterIds &&
      session.characterIds.includes(characterId) &&
      session.date < new Date()
    ) {
      // matchingSessions.push(session);
      sessionCount++;
    }
  });

  // return matchingSessions.length;
  return sessionCount;
};

/**
 * Calculates the number of sessions required to go from 1st level to the specified level
 *
 * @param {number} level The level
 *
 * @returns {number} The number of sessions required for this level
 */
const calculateOffsetSessionsRequiredForLevel = (level: number) => {
  let minimumSessions = 0;
  let currentLevel = 1;

  while (currentLevel < level) {
    currentLevel++;
    minimumSessions += calculateMaxSessionsToNextLevel(currentLevel);
  }

  return minimumSessions;
};

/**
 * Gets the colour of the character's main class
 *
 * @param {*} character
 * @return {string} The hexadecimal format of the colour of the character's main class
 */
const getMainClassColour = (character: ICharacter) => {
  const characterClass = getMainClass(character);
  let colour = characterClass;

  switch (colour) {
    case "Artificer":
      return "#d59139";

    case "Barbarian":
      return "#e7623e";

    case "Bard":
      return "#ab6dac";

    case "Cleric":
      return "#91a1b2";

    case "Druid":
      return "#7a853b";

    case "Fighter":
      return "#7f513e";

    case "Monk":
      return "#51a5c5";

    case "Paladin":
      return "#b59e54";

    case "Ranger":
      return "#507f62";

    case "Rogue":
      return "#555752";

    case "Sorcerer":
      return "#992e2e";

    case "Warlock":
      return "#7b469b";

    case "Wizard":
      return "#2a50a1";

    default:
      return "black";
  }
};

/**
 * Gets a character from a provided ID
 *
 * @param {number} id The ID of the character to get
 * @param {*} characters All the characters
 * @return {*} The entire character with the provided ID
 */
const getCharacterFromId = (id: number, characters: ICharacter[]) => {
  let matchedCharacter;

  characters.forEach((character) => {
    if (character.id === id) {
      matchedCharacter = character;
    }
  });

  return matchedCharacter;
};

/**
 * Gets all of the characters of a player, where the dndbeyond name of each match
 *
 * @param {*} player The players whose characters to get
 * @param {ICharacter[]} characters All the characters
 * @return {ICharacter[]} An array containing all the player's characters
 */
const getActiveCharactersFromPlayer = (player, characters: ICharacter[]) => {
  let matchedCharacters = [] as ICharacter[];

  characters.forEach((character) => {
    if (
      character["player-dndbeyond-name"] === player["dndbeyond-name"] &&
      !character.retirement
    ) {
      matchedCharacters.push(character);
    }
  });

  return matchedCharacters;
};

/**
 * Gets a player's display name from their dndbeyond name. If not present, returns their dndbeyond name
 *
 * @param {string} dndbeyondName The player's dndbeyond name
 * @param {any[]} players All the players
 * @return {string} The player's display name
 */
const getPlayerDisplayNameFromName = (
  dndbeyondName: string,
  players: any[]
) => {
  let displayName;

  players.forEach((player) => {
    if (player["dndbeyond-name"] === dndbeyondName) {
      displayName = player["display-name"] ?? player["dndbeyond-name"];
    }
  });

  return displayName;
};

/**
 * Gets a player from their dndbeyond name
 *
 * @param {string} dndbeyondName The player's dndbeyond name
 * @param {any[]} players All the players
 * @return {*} The player
 */
const getPlayerFromName = (dndbeyondName: string, players: any[]) => {
  let matchingPlayer;

  players.forEach((player) => {
    if (player["dndbeyond-name"] === dndbeyondName) {
      matchingPlayer = player;
    }
  });

  return matchingPlayer;
};

export {
  determineSessionCharacters,
  calculateSessionsForLevelUp,
  calculateLevelFromSessions,
  countSessionsAttended,
  getOrdinal,
  getMainClass,
  getCharacterClasses,
  getMainClassColour,
  getCharacterFromId,
  getActiveCharactersFromPlayer,
  getPlayerDisplayNameFromName,
  getPlayerFromName,
  calculateMaxSessionsToNextLevel,
};
