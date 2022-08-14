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

  /**
   * Determines if a given date is in a given month
   * @param dateToCheck The date to check
   * @param dateToCheckAgainst The date to check against
   * @returns Whether the given date is in the given month
   */
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
    dateA: Date | number | undefined,
    dateB: Date | number | undefined
  ) {
    if (dateA && dateB) {
      return new Date(dateB).getTime() - new Date(dateA).getTime();
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
