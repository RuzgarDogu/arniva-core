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
 * @typedef {Object} SortConfig
 * @property {string} key - Field to sort by
 * @property {string} order - Sort order ('asc' or 'desc')
 */
/**
 * Converts pagination, filter, and sort objects into a query string
 * @param {Pagination} [pagination={}] - Pagination parameters
 * @param {FilterObject} [filter={}] - Filter criteria
 * @param {SortConfig} [sort=null] - Sort configuration
 * @returns {string} Query string starting with "?"
 */
export function convertQueryObjectToString(pagination?: Pagination, filter?: FilterObject, sort?: SortConfig | null): string;
/**
 * Converts a query string into pagination, filter, and sort objects
 * @param {string} queryString - Query string to parse
 * @returns {{pagination: Pagination, filter: FilterObject, sort: SortConfig | null}} Object with pagination, filter, and sort properties
 */
export function convertQueryStringToObject(queryString: string): {
    pagination: Pagination;
    filter: FilterObject;
    sort: SortConfig | null;
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
export type SortConfig = {
    /**
     * - Field to sort by
     */
    key: string;
    /**
     * - Sort order ('asc' or 'desc')
     */
    order: string;
};
