<script>
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
    import { AdvancedFilter, Table, Tbody, Thead, Trow, Range } from '$lib'


    let filterConfig = {
        name: 'filterName',
        fields: [
            {
                name: 'age',
                label: 'Age',
                text: 'Select Age range',
                type: 'range',
                range: {
                    min: data.dummyData.reduce((min, row) => Math.min(min, row.age), Infinity),
                    max: data.dummyData.reduce((max, row) => Math.max(max, row.age), -Infinity)
                }
            },
            {
                name: 'gender',
                label: 'Gender',
                text: 'Select Gender',
                type: 'select',
                options: [
                    {
                        label: 'Male Employees',
                        value: 'male'
                    },
                    {
                        label: 'Female Employees',
                        value: 'female'
                    }
                ]
            },
            {
                name: 'department',
                label: 'Department',
                text: 'Select Department',
                type: 'multiselect',
                options: [
                    {
                        label: 'Production Employees',
                        value: 'Production'
                    },
                    {
                        label: 'Sales Employees',
                        value: 'Sales'
                    },
                    {
                        label: 'Accounting Employees',
                        value: 'Accounting'
                    }
                ]
            },
            {
                name: 'isManager',
                label: 'Is Manager',
                text: 'Is this person a manager?',
                type: 'boolean',
                options: [
                    {
                        label: 'Yes',
                        value: true
                    },
                    {
                        label: 'No',
                        value: false
                    }
                ]
            }
        ]
    }

    let filter = $state({});
    
    function handleChange(fields) {
        filter = fields;
    }

    /**
     * Applies filters to a dataset based on filter configuration and current filter values
     * @param {Array} data - The dataset to filter
     * @param {Object} filters - The current filter values (e.g., {gender: 'male', department: ['sales', 'accounting']})
     * @param {Object} config - The filter configuration object
     * @returns {Array} - The filtered dataset
     */
    function applyFilters(data, filters, config) {
        // return data
        // If filter is empty or null, return all data
        if (!filters || Object.keys(filters).length === 0) {
            return data;
        }

        // Get field types mapping for easy reference
        const fieldTypes = {};
        config.fields.forEach(field => {
            fieldTypes[field.name] = field.type;
        });

        // Filter the data based on the filter object
        return data.filter(row => {
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
                    if (value.min !== undefined && row[key] < value.min) {
                        return false;
                    }
                    if (value.max !== undefined && row[key] > value.max) {
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
                    const filterValue = typeof value === 'string' ? value === 'true' : value;
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

    // Use the new filtering function in your derived state
    let tableData = $derived.by(() => {
        return applyFilters(data.dummyData, filter, filterConfig);
    });
    import { Radio, Checkbox } from '$lib';

    function handleRange(value) {
        console.log("Range changed", value);
    }

</script>


<!-- <div style="margin-bottom: 30px;">
    <Range onChange={handleRange} type="single" color="primary"/>
</div>
<div style="margin-bottom: 30px;">
    <Range onChange={handleRange} type="range" color="secondary"/>
</div>
<div style="margin-bottom: 30px;">
    <Range onChange={handleRange} type="range" color="success"/>
</div>
<div style="margin-bottom: 30px;">
    <Range onChange={handleRange} type="range" color="danger"/>
</div>
<div style="margin-bottom: 30px;">
    <Range onChange={handleRange} type="range" color="warning"/>
</div>
<div style="margin-bottom: 30px;">
    <Range onChange={handleRange} type="range" color="accent" min={20} max={300}/>
</div> -->

<div style="margin-bottom: 30px;">
    <AdvancedFilter {filterConfig} onChange={handleChange}/>
</div>

<Table>
    <Thead>
        <Trow>
            <th>ID</th>
            <th>Name</th>
            <th>Age</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Departmen</th>
            <th>Date of Birth</th>
            <th>Is Manager?</th>
        </Trow>
    </Thead>
    <Tbody>
        {#each tableData as row}
            <Trow>
                <td>{row.id}</td>
                <td>{row.name}</td>
                <td>{row.age}</td>
                <td>{row.email}</td>
                <td>{row.phone}</td>
                <td>{row.gender}</td>
                <td>{row.department}</td>
                <td>{row.dob}</td>
                <td>{row.isManager}</td>
            </Trow>
        {/each}
    </Tbody>
</Table>