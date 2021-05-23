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
const determineSessionCharacters = (characters, session) => {
  if (session.players) return session.players.join(", ");

  let sessionCharacters = [] as string[];

  Object.keys(characters).forEach((key) => {
    const character = characters[key];

    if (session.characters.includes(character.id)) {
      sessionCharacters.push(character.nickname ?? character.name);
    }
  });

  return sessionCharacters.sort().join(", ");
};

/**
 * Calculates the number of sessions a character has attended
 *
 * @param {*} character The character whose session attendance to coount
 * @param {*} sessions All sessions
 * @return {number} The number of sessions a character has attended
 */
const deteremineSessionsAttended = (character, sessions) => {
  let sessionCount = 0;

  Object.keys(sessions).forEach((key) => {
    const session = sessions[key];

    if (session.players) return;

    if (
      session.characters.length > 0 &&
      session.characters.includes(character.id)
    ) {
      sessionCount++;
    }
  });

  return sessionCount;
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

const getClasses = (character) => {
  const characterClasses = character.classes;

  let classList = [] as string[];

  characterClasses.forEach((characterClass) => {
    classList.push(characterClass.class);
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
const calculateSessionsForLevelUp = (startingLevel, sessionCount) => {
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
const countSessionsAttended = (character, sessions) => {
  let matchingSessions = [] as any[];

  sessions.forEach((session) => {
    if (
      session.characters &&
      session.characters.includes(character.id) &&
      new Date(session["scheduled-date"]) < new Date()
    ) {
      matchingSessions.push(session);
    }
  });

  return matchingSessions.length;
};

/**
 * Calculates the number of sessions required to go from 1st level to the specified level
 *
 * @param {number} level The level
 *
 * @returns {number} The number of sessions required for this level
 */
const calculateOffsetSessionsRequiredForLevel = (level) => {
  let minimumSessions = 0;
  let currentLevel = 1;

  while (currentLevel < level) {
    currentLevel++;
    minimumSessions += calculateMaxSessionsToNextLevel(currentLevel);
  }

  return minimumSessions;
};

export {
  determineSessionCharacters,
  deteremineSessionsAttended,
  calculateSessionsForLevelUp,
  calculateLevelFromSessions,
  countSessionsAttended,
  getOrdinal,
  getMainClass,
  getClasses,
};
