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
export const defaultTimeConfig = {
    date: true,
    time: false,
    timeZone: 'UTC',
    format: 'US',
    separator: '.'
};

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
export function convertTime(dateString, config = defaultTimeConfig) {
    const mergedConfig = { ...defaultTimeConfig, ...config };
    const { date, time, timeZone, format, separator } = mergedConfig;
    
    const inputDate = new Date(dateString);
    
    // Use the specified timezone or local time
    const targetDate = timeZone === 'UTC' ? inputDate : 
        new Date(inputDate.toLocaleString('en-US', { timeZone: 'UTC' }));
    
    // Extract date components
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    
    // Extract time components
    const hours = String(targetDate.getHours()).padStart(2, '0');
    const minutes = String(targetDate.getMinutes()).padStart(2, '0');
    
    // Format the date based on the format type
    let dateStr = '';
    if (date) {
        switch (format) {
            case 'US':
                dateStr = `${month}${separator}${day}${separator}${year}`;
                break;
            case 'EU':
                dateStr = `${day}${separator}${month}${separator}${year}`;
                break;
            case 'ISO':
            default:
                dateStr = `${year}${separator}${month}${separator}${day}`;
                break;
        }
    }
    
    // Add time if requested
    let timeStr = '';
    if (time) {
        timeStr = `${hours}:${minutes}`;
    }
    
    // Combine date and time with proper spacing
    if (date && time) {
        return `${dateStr} ${timeStr}`;
    } else if (date) {
        return dateStr;
    } else if (time) {
        return timeStr;
    }
    
    // Return empty string if neither date nor time is requested
    return '';
}