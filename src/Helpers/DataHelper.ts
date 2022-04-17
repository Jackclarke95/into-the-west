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
}
