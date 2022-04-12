export default class DataHelper {
  /**
   * Determines if a Date occured has already occured or not
   *
   * @param date The Date to determine
   * @return Whether the datDate has already occured or not
   */
  public static isDateInPast(date: Date): boolean {
    return Number(new Date(date)) <= Number(new Date().setHours(0, 0, 0, 0));
  }
}
