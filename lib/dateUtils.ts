/**
 * Date utility functions for birthday calculations
 */

export const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/**
 * Check if a year is a leap year
 */
export const isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
};

/**
 * Get the maximum number of days in a month
 * @param month - Month number (1-12)
 * @param year - Optional year (used to determine leap year for February)
 */
export const getMaxDays = (month: number, year?: number): number => {
    if (month === 2) {
        if (year && isLeapYear(year)) return 29;
        return year ? 28 : 29; // Allow Feb 29 if no year specified (for input validation)
    }
    return DAYS_IN_MONTH[month - 1];
};

/**
 * Get the effective birthday date for a given year
 * For Feb 29 birthdays in non-leap years, returns Feb 28
 * @param month - Birthday month (1-12)
 * @param day - Birthday day (1-31)
 * @param year - The year to calculate for
 */
export const getEffectiveBirthdayDate = (month: number, day: number, year: number): Date => {
    // For Feb 29 birthdays in non-leap years, use Feb 28
    if (month === 2 && day === 29 && !isLeapYear(year)) {
        return new Date(year, 1, 28);
    }
    return new Date(year, month - 1, day);
};
