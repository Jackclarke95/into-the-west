import ICharacter from "../Interfaces/ICharacter";
import ICharacterData from "../Interfaces/ICharacterData";
import IUser from "../Interfaces/IUser";
import IPlayerData from "../Interfaces/IUserData";
import ISession from "../Interfaces/ISession";
import ISessionData from "../Interfaces/ISessionData";

export default class DataHelper {
  /**
   * Determines if a given date is in the past
   * @param date The date to determine
   * @return Whether the date is in the past
   */
  public static isDateInPast(date: Date | number): boolean {
    return (
      Number(DataHelper.getDateWithoutTime(new Date(date))) <
      Number(DataHelper.getDateWithoutTime(new Date()))
    );
  }

  public static isDateInMonth(
    dateToCheck: Date,
    dateToCheckAgainst: Date
  ): boolean {
    const currentMonth = dateToCheckAgainst.getMonth();
    const dateMonth = dateToCheck.getMonth();

    return currentMonth === dateMonth;
  }

  /**
   * Returns a given date at midnight
   * @param date The date to set to midnight
   * @returns The date at midnight
   */
  public static getDateWithoutTime(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  }

  public static addDaysToDate = (date: Date, days: number): Date => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);

    return newDate;
  };

  /**
   * Gets a date in the format Weekday, Date, Month format; e.g. "Tue 13 May"
   * @param date The date for format
   * @returns The formatted date as a string
   */
  public static getDateInDayDateMonthFormat(date: Date): string {
    const formattedDate = `${date.toLocaleString("en-GB", {
      weekday: "short",
    })} ${date.toLocaleDateString("en-GB", {
      day: "numeric",
    })} ${date.toLocaleDateString("en-GB", {
      month: "short",
    })}`;

    return formattedDate;
  }

  public static incrementMonth(date: Date): Date {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + 1);

    return newDate;
  }

  public static decrementMonth(date: Date): Date {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() - 1);

    return newDate;
  }

  /**
   * Gets a given date's day of the week
   * @param date The date
   * @returns The date's day of the week
   */
  public static getDayOfTheWeek(date: Date): string {
    const dayOfTheWeek = date.toLocaleString("en-GB", {
      weekday: "long",
    });

    return dayOfTheWeek;
  }

  public static toKebabCase(string: string): string {
    return string.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  }

  /**
   * Splits an array into multiple arrays of equal size, where the last is one less if
   * the array is not evenly divisible
   * @param array The array to split
   * @returns
   */
  public static splitArrayIntoChunks(
    array: any[],
    chunks: number
  ): [any[], any[]] {
    const half = Math.floor(array.length / chunks);

    return [array.slice(0, half), array.slice(half)];
  }

  /**
   * Splits a given array into an array of chunks of a given size
   * @param array The array to split into chunks
   * @param chunkSize The size of each chunk
   * @returns An array of arrays, each of a length which is the size of chunkSize
   */
  public static sliceArrayIntoChunks(array: any[], chunkSize: number) {
    const slicedArray = [] as any[];

    for (let i = 0; i < array.length; i += chunkSize) {
      const chunk = array.slice(i, i + chunkSize);

      slicedArray.push(chunk);
    }

    return slicedArray;
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
   * Parses Character data from the Firebase Realtime Database into ICharacter format
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

  /**
   * Parses User data from the Firebase Realtime Database into IUserData format
   * @param player The User to parse
   * @param key The key of the User in the Database
   * @returns The parsed User
   */
  public static parsePlayerData(player: IPlayerData, key: string): IUser {
    const availableDates = player.availableDates ?? [];

    return {
      key: key,
      name: player.name,
      discordTag: player.discordTag,
      dndBeyondName: player.dndBeyondName,
      isDungeonMaster: player.isDungeonMaster ?? false,
      isGamesMaster: player.isGamesMaster ?? false,
      availableDates: availableDates,
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

  /**
   * Gets the first date of a given month
   * @param date The given month
   * @returns The first date of the given month
   */
  public static getFirstDayOfMonth(date: Date): Date {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

    return new Date(
      firstDayOfMonth.getFullYear(),
      firstDayOfMonth.getMonth(),
      1
    );
  }

  public static getLastDayOfMonth(date: Date): Date {
    const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    return new Date(
      lastDayOfMonth.getFullYear(),
      lastDayOfMonth.getMonth(),
      lastDayOfMonth.getDate()
    );
  }

  public static getMondayOfWeek(date: Date): Date {
    const day = date.getDay();

    return new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() - day + (day === 0 ? -6 : 1)
    );
  }

  public static getDaysOfWeek(date: Date): Date[] {
    const startDate = this.getMondayOfWeek(date);

    const daysOfWeek = [] as Date[];

    for (let i = 0; i < 7; i++) {
      daysOfWeek.push(
        new Date(
          startDate.getFullYear(),
          startDate.getMonth(),
          startDate.getDate() + i
        )
      );
    }

    return daysOfWeek;
  }

  /**
   * Gets an array of full weeks for each week in the given month, including weeks that are not fully
   * in the given month
   * @param date The date
   * @returns An array of arrays of dates, each array representing a week
   */
  public static getFullWeeksOfMonth(date: Date): Date[][] {
    let weeksOfMonth = [] as Date[][];

    const firstDayOfMonth = DataHelper.getFirstDayOfMonth(date);
    const lastDayOfMonth = DataHelper.getLastDayOfMonth(date);
    const firstMondayToRender = DataHelper.getMondayOfWeek(firstDayOfMonth);
    const lastMondayToRender = DataHelper.getMondayOfWeek(lastDayOfMonth);

    var currentMonday = firstMondayToRender;

    do {
      const week = DataHelper.getDaysOfWeek(currentMonday);
      weeksOfMonth.push(week);

      currentMonday.setDate(currentMonday.getDate() + 7);
    } while (currentMonday.getTime() <= lastMondayToRender.getTime());

    return weeksOfMonth;
  }
}
