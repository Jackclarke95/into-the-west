import ICharacter from "../Interfaces/ICharacter";
import ICharacterData from "../Interfaces/ICharacterData";
import IUser from "../Interfaces/IUser";
import IUserData from "../Interfaces/IUserData";
import ISession from "../Interfaces/ISession";
import ISessionData from "../Interfaces/ISessionData";

export default class DataHelper {
  /**
   * Determines if a given date is in the past
   *
   * @param date The date to determine
   * @return Whether the date is in the past
   */
  public static isDateInPast(date: Date): boolean {
    return Number(new Date(date)) <= Number(new Date().setHours(0, 0, 0, 0));
  }

  /**
   * Formats a number into its ordinal format
   * @param number The number to format
   * @returns The formatted number
   */
  public static formatOrdinalNumber(number: number): string {
    const suffix = ["th", "st", "nd", "rd"];
    const remainder = number % 100;

    return (
      number + (suffix[(remainder - 20) % 10] || suffix[remainder] || suffix[0])
    );
  }

  /**
   * Determines whether a string starts with a vowel
   * @param word The string to determine
   * @returns Whether the string starts with a vowel
   */
  public static startsWithVowel(word: string): boolean {
    return /^[aeiou]/i.test(word);
  }

  /**
   * Gets a random element from an array
   * @param array The array to get a random element from
   * @returns A random element from the array
   */
  public static getRandomFromArray(array: any[]): any {
    return array[Math.floor(Math.random() * array.length)];
  }

  /**
   * Parses Session data from the Firebase Realtim Database into ISession format
   * @param session The session data to parse
   * @param key The key of the Session in the Database
   * @returns The parsed Session
   */
  public static parseSessionData(session: ISessionData, key: string): ISession {
    return {
      key: key,
      name: session.name,
      dungeonMaster: session.dungeonMaster,
      map: session.map,
      date: session.date ? new Date(session.date) : undefined,
      attendees: session.attendees,
    };
  }

  /**
   * Parses Character data from the Firebase Realtim Database into ICharacter format
   * @param character The character to parse
   * @param key The key of the Character in the Database
   * @returns The parsed Character
   */
  public static parseCharacterData(
    character: ICharacterData,
    key: string
  ): ICharacter {
    return {
      key: key,
      avatarUrl: character.avatarUrl ?? undefined,
      sheetUrl: character.sheetUrl ?? undefined,
      playerDndBeyondName: character.playerDndBeyondName,
      name: character.name,
      nickname: character.nickname,
      classes: character.classes.map((cls) => ({
        name: cls.name,
        archetype: cls.archetype,
        level: cls.level,
      })),
      currentLevel: character.currentLevel,
      startingLevel: character.startingLevel,
      sessionsAttended: character.sessionsAttended,
      retirement: character.retirement
        ? {
            reason: character.retirement.reason,
            date: new Date(character.retirement.date),
          }
        : undefined,
      race: { race: character.race, subrace: character.subrace },
    };
  }

  public static parsePlayerData(player: IUserData, key: string): IUser {
    return {
      key: key,
      name: player.name,
      discordTag: player.discordTag,
      dndBeyondName: player.dndBeyondName,
      isDungeonMaster: player.isDungeonMaster ?? false,
      isGamesMaster: player.isGamesMaster ?? false,
    };
  }

  /**
   * Sorts two dates in ascending order
   * @param dateA The first date to compare
   * @param dateB The second date to compare
   * @returns The sorted dates
   */
  public static sortNullableDatesAscending(
    dateA: Date | undefined,
    dateB: Date | undefined
  ) {
    if (dateA && dateB) {
      return dateA.getTime() - dateB.getTime();
    } else if (dateA) {
      return -1;
    } else if (dateB) {
      return 1;
    }

    return 0;
  }

  /**
   * Sorts two dates in descending order
   * @param dateA The first date to compare
   * @param dateB The second date to compare
   * @returns The sorted dates
   */
  public static sortNullableDatesDescending(
    dateA: Date | undefined,
    dateB: Date | undefined
  ) {
    if (dateA && dateB) {
      return dateB.getTime() - dateA.getTime();
    } else if (dateA) {
      return 1;
    } else if (dateB) {
      return -1;
    }

    return 0;
  }
}
