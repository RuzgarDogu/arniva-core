<script>
    import Radio from '../Radio.svelte';
    import Checkbox from '../Checkbox.svelte';

    let { field, onChange, multiple = false } = $props();
    
    // Create a local copy of the field to avoid direct mutation
    let _field = $derived(JSON.parse(JSON.stringify(field)));
    
    // Initialize state based on field.value and multiple mode
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
    
    // Function to handle selection change
    function handleSelection(value) {
        if (multiple) {
            // Multi-select mode
            const index = selectedValues.indexOf(value);
            
            if (index === -1) {
                // Add value if not already selected
                selectedValues = [...selectedValues, value];
            } else {
                // Remove value if already selected
                selectedValues = selectedValues.filter(option => option !== value);
            }
        } else {
            // Single-select mode
            selectedValues = value;
        }
        
        // Update the field value in parent component
        _field.value = selectedValues;
        _field && onChange && onChange(_field);
    }
    
    // Helper function to determine if options are simple strings or objects
    function isSimpleOptions(options) {
        return options && options.length > 0 && typeof options[0] !== 'object';
    }
    
    // Helper function to check if an option is selected
    function isSelected(value) {
        if (multiple) {
            return selectedValues && selectedValues.includes(value);
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
