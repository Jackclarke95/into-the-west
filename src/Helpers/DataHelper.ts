import ISessionData from "../Interfaces/ISessionData";

export default class DataHelper {
  /**
   * Determines if a session occured has already occured or not
   *
   * @param session The session to determine
   * @return Whether the session occured has already occured or not
   */
  public static isDateInPast(date: Date): boolean {
    return Number(new Date(date)) <= Number(new Date().setHours(0, 0, 0, 0));
  }

  public static compareDates(date1: Date, date2: Date): number {
    return Number(date1) - Number(date2);
  }
}
