/**
 * @typedef {Object} Pagination
 * @property {number} [offset] - Offset for pagination
 * @property {number} [limit] - Limit for pagination
 */
/**
 * @typedef {Object} SearchFilter
 * @property {string} column - Column to search in
 * @property {string} value - Search value
 */
/**
 * @typedef {Object} RangeFilter
 * @property {number} [min] - Minimum value for range
 * @property {number} [max] - Maximum value for range
 */
/**
 * @typedef {Object} DateRangeFilter
 * @property {string} [start] - Start date for range
 * @property {string} [end] - End date for range
 */
/**
 * @typedef {Object.<string, *>} FilterObject
 */
/**
 * Converts pagination and filter objects into a query string
 * @param {Pagination} [pagination={}] - Pagination parameters
 * @param {FilterObject} [filter={}] - Filter criteria
 * @returns {string} Query string starting with "?"
 */
export function convertQueryObjectToString(pagination?: Pagination, filter?: FilterObject): string;
/**
 * Converts a query string into pagination and filter objects
 * @param {string} queryString - Query string to parse
 * @returns {{pagination: Pagination, filter: FilterObject}} Object with pagination and filter properties
 */
export function convertQueryStringToObject(queryString: string): {
    pagination: Pagination;
    filter: FilterObject;
};
export type Pagination = {
    /**
     * - Offset for pagination
     */
    offset?: number | undefined;
    /**
     * - Limit for pagination
     */
    limit?: number | undefined;
};
export type SearchFilter = {
    /**
     * - Column to search in
     */
    column: string;
    /**
     * - Search value
     */
    value: string;
};
export type RangeFilter = {
    /**
     * - Minimum value for range
     */
    min?: number | undefined;
    /**
     * - Maximum value for range
     */
    max?: number | undefined;
};
export type DateRangeFilter = {
    /**
     * - Start date for range
     */
    start?: string | undefined;
    /**
     * - End date for range
     */
    end?: string | undefined;
};
export type FilterObject = {
    [x: string]: any;
};
