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
   * Gets a random element from an array
   * @param array The array to get a random element from
   * @returns A random element from the array
   */
  public static getRandomFromArray(array: any[]): any {
    return array[Math.floor(Math.random() * array.length)];
  }

  public static parseSessionData(session: ISessionData): ISession {
    return {
      key: session.key,
      name: session.name,
      dungeonMaster: session.dungeonMaster,
      map: session.map,
      date: session.date ? new Date(session.date) : undefined,
      attendees: session.attendees,
    };
  }

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
