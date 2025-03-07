/**
 * @typedef {Object} RangeValue
 * @property {number|string} [min] - Minimum value for range (number or date string)
 * @property {number|string} [max] - Maximum value for range (number or date string)
 * @property {number|string} [start] - Alternative start value for range (number or date string)
 * @property {number|string} [end] - Alternative end value for range (number or date string)
 */

/**
 * @typedef {Object} SearchConfig
 * @property {string} [placeholder] - Placeholder text for search input
 * @property {string[]} columns - Columns to search in
 */

/**
 * @typedef {Object} FilterConfig
 * @property {string} name - Name of the filter
 * @property {SearchConfig} [search] - Search configuration
 * @property {FilterField[]} fields - Filter fields configuration
 */

/**
 * @typedef {Object} FilterField
 * @property {string} name - Unique identifier for the field
 * @property {string} label - Display label for the field
 * @property {string} text - Descriptive text for the field
 * @property {string} type - Field type ('range', 'select', 'multiselect', 'boolean', 'daterange', etc.)
 * @property {RangeConfig} [range] - Configuration for range-type fields
 * @property {Option[]} [options] - Available options for select-type fields
 * @property {boolean} [isAmerican] - Whether dates should be parsed in American format (MM/DD/YYYY) instead of European (DD/MM/YYYY)
 */
/**
 * @typedef {Object} RangeConfig
 * @property {number} min - Minimum value for range
 * @property {number} max - Maximum value for range
 */

/**
 * @typedef {Object} Option
 * @property {string} label - Display text for the option
 * @property {*} value - Value associated with the option
 */

/**
 * @typedef {Object} Field
 * @property {string} name - Unique identifier for the field
 * @property {string} label - Display label for the field
 * @property {string} text - Descriptive text for the field
 * @property {string} type - Field type ('range', 'select', 'multiselect', 'boolean', etc.)
 * @property {Array<Option>} [options] - Available options for select-type fields
 * @property {string|Array<string>|boolean|RangeValue|null} value - Current field value
 * @property {boolean} isOpen - Whether this field's dropdown is open
 * @property {number} order - Order in which fields were opened
 * @property {boolean|null|undefined} [dateRange] - Whether this field is a range filter
 * @property {boolean} [isAmerican] - Whether dates should be parsed in American format (MM/DD/YYYY) instead of European (DD/MM/YYYY)
 */

/**
 * @typedef {Object<string, any>} DataRow
 * An object representing a row of data to be filtered
 */

/**
 * @typedef {Object<string, *>} FieldTypeMap
 * A mapping of field names to their types
 */

/**
 * @typedef {Object} DateRange
 * @property {string} [start] - Start date of the range
 * @property {string} [end] - End date of the range
 */

/**
 * @typedef {Object} Filters
 * @property {string} [search] - Text to search for across specified columns
 * @property {Object<string, string|boolean|number|string[]|RangeValue>} [fields] - Field-specific filter values
 * An object containing filter criteria, with field names as keys and filter values as values.
 */

/**
 * Applies filters to data based on provided filter criteria and configuration
 *
 * @callback ApplyFiltersFunction
 * @param {Array<DataRow>} data - Array of data objects to filter
 * @param {Filters} filters - Object containing filter criteria
 * @param {FilterConfig} config - Filter configuration
 * @returns {Array<DataRow>} - Filtered array of data objects
 */

// Export the types
export {};