<script>
    import Radio from '../Radio.svelte';
    import Checkbox from '../Checkbox.svelte';

    /**
     * @typedef {import('./types').Field} Field
     * @typedef {import('./types').Option} Option
     */

    /**
     * @typedef {Object} Props
     * @property {Field} field - The field configuration object
     * @property {Function} onChange - Function to call when the field value changes
     * @property {boolean} [multiple=false] - Whether multiple selections are allowed
     */

    /** @type {Props} */
    let { field, onChange, multiple = false } = $props();
    
    // Create a local copy of the field to avoid direct mutation
    let _field = $derived(JSON.parse(JSON.stringify(field)));
    
    // Initialize state based on field.value and multiple mode
    /** @type {string|string[]|boolean|import('./types').RangeValue|null} */
    let selectedValues = $state(
        multiple 
            ? (field.value && Array.isArray(field.value) ? field.value : [])
            : field.value
    );
    
    // Watch for changes in field.value from parent component
    $effect(() => {
        selectedValues = multiple
            ? (field.value && Array.isArray(field.value) ? field.value : [])
            : field.value;
    });
    
    /**
     * Function to handle selection change
     * @param {string|boolean} value - The selected option value
     */
    function handleSelection(value) {
        if (multiple) {
            // Multi-select mode
            /** @type {string[]} */
            const currentValues = /** @type {string[]} */ (selectedValues) || [];
            const index = currentValues.indexOf(/** @type {string} */(value));
            
            if (index === -1) {
                // Add value if not already selected
                selectedValues = [...currentValues, /** @type {string} */(value)];
            } else {
                // Remove value if already selected
                selectedValues = currentValues.filter(/** @param {string} option */ option => option !== value);
            }
        } else {
            // Single-select mode
            selectedValues = value;
        }
        
        // Update the field value in parent component
        _field.value = selectedValues;
        _field && onChange && onChange(_field);
    }
    
    /**
     * Helper function to determine if options are simple strings or objects
     * @param {Array<string|Option>|undefined} options - The options array to check
     * @returns {boolean} True if options are simple strings
     */
    function isSimpleOptions(options) {
        return Array.isArray(options) && options.length > 0 && typeof options[0] !== 'object';
    }
    
    /**
     * Helper function to check if an option is selected
     * @param {string|boolean} value - The option value to check
     * @returns {boolean} True if the option is selected
     */
    function isSelected(value) {
        if (multiple) {
            /** @type {string[]} */
            const values = /** @type {string[]} */ (selectedValues) || [];
            return values.includes(/** @type {string} */(value));
        } else {
            // Handle special case for boolean values
            if (typeof selectedValues === 'boolean' || typeof value === 'boolean') {
                return selectedValues === value;
            }
            
            // String comparison for other values
            return String(selectedValues) === String(value);
        }
    }

    // Get appropriate component based on multiple mode using derived state
    const SelectionComponent = $derived(multiple ? Checkbox : Radio);
</script>

<!-- Template section remains unchanged -->

<div class="advanced-filter--selection {multiple ? 'advanced-filter--multiselect' : 'advanced-filter--single-select'}">
    <div class="advanced-filter--filter-options">
        {#if isSimpleOptions(_field.options)}
            <!-- For simple string array options -->
            {#each _field.options as option}
                <div class="advanced-filter--item">
                    <SelectionComponent 
                        name={_field.name} 
                        value={option} 
                        label={String(option)}
                        checked={isSelected(option)}
                        onchange={() => handleSelection(option)} 
                    />
                </div>
            {/each}
        {:else}
            <!-- For object options with label/value pairs -->
            {#each _field.options as option}
                <div class="advanced-filter--item">
                    <SelectionComponent 
                        name={_field.name} 
                        value={option.value} 
                        label={option.label}
                        checked={isSelected(option.value)}
                        onchange={() => handleSelection(option.value)}
                    />
                </div>
            {/each}
        {/if}
    </div>
</div>
