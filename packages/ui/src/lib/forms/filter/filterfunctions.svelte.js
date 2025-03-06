/**
 * @typedef {import('./types').DataRow} DataRow
 * @typedef {import('./types').Filters} Filters
 * @typedef {import('./types').FilterConfig} FilterConfig
 * @typedef {import('./types').ApplyFiltersFunction} ApplyFiltersFunction
 * @typedef {import('./types').FieldTypeMap} FieldTypeMap
 * @typedef {import('./types').RangeValue} RangeValue
 * @typedef {import('./types').SearchConfig} SearchConfig
 */

/**
 * Applies filters to data based on provided filter criteria and configuration
 *
 * @type {ApplyFiltersFunction}
 */
export function applyFilters(data, filters, config) {
    // If filter is empty or null, return all data
    if (!filters || Object.keys(filters).length === 0) {
        return data;
    }

    // Create a copy to work with
    let filteredData = [...data];

    // Handle search separately before other filters
    if ('search' in filters && 
        typeof filters.search === 'string' && 
        filters.search && 
        config.search && 
        Array.isArray(config.search.columns)) {
        
        // Store search config in a variable to help TypeScript understand it's not undefined
        /** @type {SearchConfig} */
        const searchConfig = config.search;
        
        const searchTerms = filters.search.toLowerCase().trim().split(/\s+/);
        filteredData = filteredData.filter(row => {
            // Must match all search terms across any combination of columns
            return searchTerms.every(term => {
                // Check if any column contains this term
                return searchConfig.columns.some(column => {
                    return row[column] !== undefined && 
                           row[column] !== null && 
                           String(row[column]).toLowerCase().includes(term);
                });
            });
        });
        
        // Create a new filters object without the search property for the rest of the filtering
        const {  ...otherFilters } = filters;
        filters = otherFilters;
    }

    // Get field types mapping for easy reference
    /** @type {FieldTypeMap} */
    const fieldTypes = {};
    config.fields.forEach(field => {
        fieldTypes[field.name] = field.type;
    });

    // Apply the rest of the filters
    return filteredData.filter(row => {
        // Check each filter criteria
        for (const [key, value] of Object.entries(filters)) {
            // Skip empty filter values
            if (value === null || value === undefined || value === '' || 
                (Array.isArray(value) && value.length === 0)) {
                continue;
            }

            // Handle different filter types based on configuration
            const filterType = fieldTypes[key];
            
            if (filterType === 'range') {
                // Range filter (e.g., { min: 25, max: 50 })
                /** @type {RangeValue} */
                const rangeValue = /** @type {RangeValue} */ (value);
                if (rangeValue.min !== undefined && row[key] < rangeValue.min) {
                    return false;
                }
                if (rangeValue.max !== undefined && row[key] > rangeValue.max) {
                    return false;
                }
            }
            else if (filterType === 'multiselect') {
                // Multiselect filter (array of values)
                if (!Array.isArray(value)) {
                    console.warn(`Expected array for multiselect filter ${key}, got:`, value);
                    continue;
                }
                if (!value.includes(row[key])) {
                    return false;
                }
            } 
            else if (filterType === 'boolean') {
                // Boolean filter (might need conversion from string)
                const filterValue = typeof value === 'string' ? value === 'true' : Boolean(value);
                if (row[key] !== filterValue) {
                    return false;
                }
            } 
            else {
                // Standard equality filters (string, number, select, etc.)
                if (row[key] !== value) {
                    return false;
                }
            }
        }
        
        // If all filters pass, include this row
        return true;
    });
}