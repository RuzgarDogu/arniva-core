/**
 * Character used to replace spaces in search strings
 * @type {string}
 */
const SPACE_REPLACEMENT_CHAR = '%3B';

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
 * @param {SortConfig|null} [sort=null] - Sort configuration
 * @returns {string} Query string starting with "?"
 */
export function convertQueryObjectToString(pagination = {}, filter = {}, sort = null) {
    // Ensure we have objects to work with, not null
    pagination = pagination || {};
    filter = filter || {};
    
    // Start building the query string (without endpoint)
    let queryString = "?";
    /** @type {string[]} */
    const params = [];
    
    // Add offset and limit if they exist
    if (pagination.offset !== undefined) {
        params.push(`offset=${pagination.offset}`);
    }
    if (pagination.limit !== undefined) {
        params.push(`limit=${pagination.limit}`);
    }
    
    // Process filter fields to create filter parts
    /** @type {string[]} */
    const filterParts = [];
    
    // Process each filter field
    for (const [filterKey, filterValue] of Object.entries(filter)) {
        // Skip undefined, null or empty values
        if (filterValue === undefined || filterValue === null || filterValue === '') {
            continue;
        }
        processPropForFilter(filterKey, filterValue, filterParts);
    }
    
    // Add filter parameter if we have any filter parts
    if (filterParts.length > 0) {
        params.push(`filter=${filterParts.join(' and ')}`);
    }
    
    // Add sort parameter if it exists
    console.log('sort in function', sort);
    if (sort && sort.key && sort.order) {
        params.push(`sort=${sort.key} ${sort.order}`);
    }
    
    // Join all params with &
    queryString += params.join('&');
    return queryString;
}

/**
 * Helper function to process a property and add appropriate filter parts
 * @param {string} key - The filter key/property name
 * @param {*} value - The filter value (can be various types)
 * @param {string[]} filterParts - Array to collect filter expressions
 * @returns {void}
 */
function processPropForFilter(key, value, filterParts) {
    // Case 1: Search object with column and value
    if (key === 'search' && 
        typeof value === 'object' && 
        value !== null && 
        'column' in value && 
        'value' in value) {
        const searchObj = value;
        // Only add if both column and value are non-empty
        if (searchObj.column && searchObj.value) {
            // Format search value: replace spaces with SPACE_REPLACEMENT_CHAR and wrap in single quotes
            const formattedSearchValue = `'${searchObj.value.replace(/\s+/g, SPACE_REPLACEMENT_CHAR)}'`;
            filterParts.push(`${searchObj.column} co ${formattedSearchValue}`);
        }
        return;
    }
    
    // Case 2: Object with min/max (numeric range)
    if (typeof value === 'object' && 
        value !== null && 
        !Array.isArray(value) && 
        ('min' in value || 'max' in value)) {
        const rangeObj = value;
        if (rangeObj.min !== undefined) {
            filterParts.push(`${key} ge ${rangeObj.min}`);
        }
        if (rangeObj.max !== undefined) {
            filterParts.push(`${key} le ${rangeObj.max}`);
        }
        return;
    }
    
    // Case 3: Object with start/end (date range)
    if (typeof value === 'object' && 
        value !== null && 
        !Array.isArray(value) && 
        ('start' in value || 'end' in value)) {
        const dateRangeObj = value;
        if (dateRangeObj.start) {
            filterParts.push(`${key} ge ${dateRangeObj.start}`);
        }
        if (dateRangeObj.end) {
            filterParts.push(`${key} le ${dateRangeObj.end}`);
        }
        return;
    }
    
    // Case 4: Boolean value
    if (typeof value === 'boolean') {
        filterParts.push(`${key} eq ${value ? 1 : 0}`);
        return;
    }
    
    // Case 5: Array value (IN operator)
    if (Array.isArray(value)) {
        // Check if array is not empty
        if (value.length > 0) {
            // Join all array values with pipe separator and use a single IN operator
            filterParts.push(`${key} in ${value.join('|')}`);
        }
        return;
    }
    
    // Case 6: Simple string/number equality - make sure we have a value
    if ((typeof value === 'string' && value !== '') || 
        (typeof value === 'number' && !isNaN(value))) {
        filterParts.push(`${key} eq ${value}`);
        return;
    }
}

/**
 * Converts a query string into pagination, filter, and sort objects
 * @param {string} queryString - Query string to parse
 * @returns {{pagination: Pagination, filter: FilterObject, sort: SortConfig|null}} Object with pagination, filter, and sort properties
 */
export function convertQueryStringToObject(queryString) {
    // Extract the query part
    const queryPart = queryString.includes('?') ? queryString.split('?')[1] : queryString;
    if (!queryPart) return { pagination: {}, filter: {}, sort: null };
    
    // Initialize result objects
    /** @type {Pagination} */
    const pagination = {};
    /** @type {FilterObject} */
    const filter = {};
    /** @type {SortConfig|null} */
    let sort = null;
    
    // Parse the query parameters
    const params = new URLSearchParams(queryPart);
    
    // Handle offset and limit directly for pagination
    if (params.has('offset')) {
        const offsetValue = params.get('offset');
        if (offsetValue !== null) {
            pagination.offset = parseInt(offsetValue);
        }
    }
    if (params.has('limit')) {
        const limitValue = params.get('limit');
        if (limitValue !== null) {
            pagination.limit = parseInt(limitValue);
        }
    }
    
    // Handle filter
    if (params.has('filter')) {
        const filterString = params.get('filter');
        if (filterString !== null) {
            // Split by "and" - simple split first, then trim each part
            /** @type {string[]} */
            const filterParts = filterString
                .split(' and ')
                .map(part => part.trim())
                .filter(part => part.length > 0);
            
            // Process each filter part
            for (const part of filterParts) {
                // Split each filter part into [field, operator, value]
                const segments = part.split(' ');
                if (segments.length < 3) continue;
                
                const field = segments[0];
                const operator = segments[1];
                const value = segments.slice(2).join(' '); // Rejoin any value parts
                
                // Handle different operators
                processFilterPart(field, operator, value, filter);
            }
        }
    }
    
    // Handle sort
    if (params.has('sort')) {
        const sortString = params.get('sort');
        if (sortString !== null) {
            const sortParts = sortString.split(' ');
            if (sortParts.length >= 2) {
                sort = {
                    key: sortParts[0],
                    order: sortParts[1]
                };
            }
        }
    }
    
    return { pagination, filter, sort };
}

/**
 * Helper function to process filter parts when converting string to object
 * @param {string} field - The field name in the filter
 * @param {string} operator - The operator (eq, ge, le, co, in)
 * @param {string} value - The filter value as string
 * @param {FilterObject} filter - The filter object being built
 * @returns {void}
 */
function processFilterPart(field, operator, value, filter) {
    // Handle contains operator (for search)
    if (operator === 'co') {
        // Clean up the value - remove quotes and convert space replacement back to spaces
        let cleanValue = value;
        if (cleanValue.startsWith("'") && cleanValue.endsWith("'")) {
            cleanValue = cleanValue.substring(1, cleanValue.length - 1);
        }
        cleanValue = cleanValue.replace(new RegExp(SPACE_REPLACEMENT_CHAR, 'g'), ' ');
        
        /** @type {SearchFilter} */
        filter.search = {
            column: field,
            value: cleanValue
        };
    }
    // Handle greater than or equal (for min/start)
    else if (operator === 'ge') {
        // Check if it looks like a date
        if (value.includes('T') || value.includes('-')) {
            if (!filter[field] || typeof filter[field] !== 'object' || Array.isArray(filter[field])) {
                filter[field] = {};
            }
            filter[field].start = value;
        } else {
            if (!filter[field] || typeof filter[field] !== 'object' || Array.isArray(filter[field])) {
                filter[field] = {};
            }
            filter[field].min = isNaN(Number(value)) ? 0 : Number(value);
        }
    }
    // Handle less than or equal (for max/end)
    else if (operator === 'le') {
        // Check if it looks like a date
        if (value.includes('T') || value.includes('-')) {
            if (!filter[field] || typeof filter[field] !== 'object' || Array.isArray(filter[field])) {
                filter[field] = {};
            }
            filter[field].end = value;
        } else {
            if (!filter[field] || typeof filter[field] !== 'object' || Array.isArray(filter[field])) {
                filter[field] = {};
            }
            filter[field].max = isNaN(Number(value)) ? 0 : Number(value);
        }
    }
    // Handle in operator (for arrays)
    else if (operator === 'in') {
        // Split the value by pipe to get individual items
        const values = value.split('|').map(v => v.trim());
        
        // Create or update the array in the filter object
        if (!filter[field]) {
            filter[field] = values;
        } else if (!Array.isArray(filter[field])) {
            // If it's not already an array, convert it and add the values
            filter[field] = [filter[field], ...values];
        } else {
            // If it's already an array, add the new values
            filter[field].push(...values);
        }
    }
    // Handle equals operator
    else if (operator === 'eq') {
        // Check if it's a boolean (1/0)
        if (value === '1' || value === '0') {
            filter[field] = value === '1';
        } 
        // Check if it's a number
        else if (!isNaN(Number(value)) && !value.startsWith('0')) {
            filter[field] = Number(value);
        }
        // Otherwise it's a string
        else {
            filter[field] = value;
        }
    }
}