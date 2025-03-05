/**
 * @typedef {Object} RangeValue
 * @property {number} [min] - Minimum value for range
 * @property {number} [max] - Maximum value for range
 * @property {number} [start] - Alternative start value for range
 * @property {number} [end] - Alternative end value for range
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
 */

/**
 * @typedef {Object} Option
 * @property {string} label - Display text for the option
 * @property {*} value - Value associated with the option
 */

// Export the types
export {};