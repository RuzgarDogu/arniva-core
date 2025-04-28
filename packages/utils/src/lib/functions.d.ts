/**
 * Converts a date string to a formatted date string based on the provided config
 * @param {string} dateString - The date string to convert
 * @param {Object} config - The configuration object
 * @param {boolean} config.date - Whether to include the date in the output
 * @param {boolean} config.time - Whether to include the time in the output
 * @param {('UTC'|'local')} config.timeZone - The timezone to use
 * @param {('US'|'EU'|'ISO')} config.format - The date format to use
 * @param {string} config.separator - The separator to use between date parts
 * @returns {string} - The formatted date string
 */
export function convertTime(dateString: string, config?: {
    date: boolean;
    time: boolean;
    timeZone: ("UTC" | "local");
    format: ("US" | "EU" | "ISO");
    separator: string;
}): string;
/**
 * Default configuration for date/time conversion
 * @type {{
 *   date: boolean,
 *   time: boolean,
 *   timeZone: ('UTC'|'local'),
 *   format: ('US'|'EU'|'ISO'),
 *   separator: string
 * }}
 */
export const defaultTimeConfig: {
    date: boolean;
    time: boolean;
    timeZone: ("UTC" | "local");
    format: ("US" | "EU" | "ISO");
    separator: string;
};
