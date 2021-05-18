import React, { useState } from "react";

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

  Object.keys(characters).map((key) => {
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

  Object.keys(sessions).map((key) => {
    const session = sessions[key];

    if (session.players) return;

    if (session.characters.includes(character.id)) {
      sessionCount++;
    }
  });

  return sessionCount;
};

/**
 * Calculates the number of sessions required for a character to gain a new level from
 * the start of the previous level
 *
 * @param {number} level The level for which to calculate the
 *
 * @returns {number} The number of sessions required for this level
 */
const calculateMaxSessionsToNextLevel = (level: number) => {
  return Math.trunc(level / 6 + 2);
};

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
};