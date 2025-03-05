<script>
    import Dropdown from "../../general/Dropdown.svelte";
    import Button from "../../general/Button.svelte";
    import DropdownContent from "../../general/DropdownContent.svelte";
    import Input from "../Input.svelte";
    import InputGroup from "../InputGroup.svelte";
    import Icon from "../../icons/Icon.svelte";
    import AdvancedFilterContent from "./AdvancedFilterContent.svelte";
    import Checkbox from "../Checkbox.svelte";

    /**
     * @typedef {Object} Props
     * @property {Object} filterConfig - The filter configuration object
     * @property {string} filterConfig.name - The name of the filter
     * @property {Array<Field>} filterConfig.fields - Array of field configurations
     * @property {Function} onChange - Callback function triggered when filter values change
     */
    
    /**
     * @typedef {import('./types').Field} Field
     */
    
    /** @type {Props} */
    let { filterConfig, onChange } = $props();
    
    // Keep track of the current highest order
    let currentOrder = $state(0);

    let fields = $state(filterConfig.fields.map(field => {
        return {
            ...field,
            value: '',
            isOpen: false,
            order: -1, // Initialize with -1 (means never opened)
        }
    }));

    // Use an object to store dropdown references
    /** @type {Object.<string, {show: Function, hide: Function}>} */
    let fieldDropdown = $state({});
    /** 
     * @typedef {Object} DropdownControl
     * @property {Function} show - Function to show the dropdown
     * @property {Function} hide - Function to hide the dropdown
     */
    
    /** @type {DropdownControl|null} */
    let filterDropdown = $state(null);

    /**
     * Function to toggle filter visibility
     * @param {Field} field - The field to toggle
     */
    function toggleFieldDropdown(field) {        
        // Toggle the isOpen state
        let _field = fields.find(f => f.name === field.name);
        if (!_field) return;
        _field.isOpen = !_field.isOpen;
        
        // If opening, always assign the highest order
        if (_field.isOpen) {
            currentOrder++;
            _field.order = currentOrder;
        }
        
        // Ensure next tick to allow rendering
        setTimeout(() => {
            // Get the dropdown reference (after the state has been updated)
            let dd = fieldDropdown[field.name];
            
            if (dd && _field.isOpen) {
                dd.show();
                filterDropdown && filterDropdown.hide();
            } else if (dd && !_field.isOpen) {
                dd.hide();
            } else {
                console.log("Dropdown reference not found");
            }
        }, 10);
    }

    /**
 * Function to toggle filter visibility
 * @param {Field} field - The field to toggle
 */
    function handleCheckboxChange(field) {
        if (!field) return;
        toggleFieldDropdown(field);
    }


    /** @type {Record<string, any>} */
    let filter = $state({});

    /**
     * Function to handle field value changes
     * @param {{name: string, value: any}} e - The change object with field name and new value
     */
    function handleChange(e) {
        /** @type {Field|undefined} */
        let _field = fields.find(f => f.name === e.name);
        if (!_field) return;
        
        _field.value = e.value;
        filter[e.name] = e.value;
        onChange && fields && onChange(filter);
    }

    let orderedOpenFields = $derived.by(() => {
        // Sort by order (most recently opened last)
        return fields.filter(f => f.isOpen).sort((a, b) => a.order - b.order);
    });

    /**
     * Function to delete a field from the filter
     * @param {Field} field - The field to delete
     */
    function deleteField(field) {
        field.isOpen = false;
        field.value = '';
        field.order = -1;
        filter[field.name] = '';
        onChange && fields && onChange(filter);
    }

    function getRangeValue(/** @type {import('./types').RangeValue} */ value) {
        if (value && typeof value === 'object') {
            return {
                start: value.min ?? value.start,
                end: value.max ?? value.end
            };
        }
        return value;
    }

</script>

<InputGroup class="advanced-filter">
    <Dropdown bind:this={filterDropdown}>
        <Button dropdown size="small" square color="primary" class="advanced-filter--main-button">
            <Icon name="filter" size="14px"/>
            Filter
        </Button>
        <DropdownContent>
            {#each fields as field}
                <div class="advanced-filter--item">
                    <Checkbox 
                        name={field.name} 
                        checked={field.isOpen} 
                        onchange={() => handleCheckboxChange(field)}
                        label={field.label}
                        class="advanced-filter---checkbox"
                    />
                </div>
            {/each}
        </DropdownContent>
    </Dropdown>

    {#each orderedOpenFields as field (field.name)}
        <div class="advanced-filter--dropdown-wrapper">
            <Dropdown bind:this={fieldDropdown[field.name]}>
                <div class="advanced-filter--dropdown">
                    <Button dropdown size="small" square color="transparent">
                        {field.label}
                        {#if field.value !== null && field.value !== undefined}
                            {#if field.type === 'range' && field.value && typeof field.value === 'object'}
                            {@const rangeValue = getRangeValue(field.value)}
                                <span class="advanced-filter--item-label">
                                    ({rangeValue.start} - {rangeValue.end})
                                </span>
                            {:else}
                                {@const val = field.options?.find(o => o.value === field.value)}
                                {#if val && val.label}
                                    <span class="advanced-filter--item-label">({val.label})</span>
                                {:else if field.value}
                                    <span class="advanced-filter--item-label">({field.value})</span>
                                {/if}
                            {/if}
                        {/if}
                    </Button>
                    <Button class="advanced-filter--close" size="small" square color="transparent" onClick={() => deleteField(field)}>
                        <Icon name="xmark" size="12px"/>
                    </Button>
                </div>
                <DropdownContent>
                    <AdvancedFilterContent {field} onChange={handleChange} />
                </DropdownContent>
            </Dropdown>
        </div>
    {/each}

    <Input />
</InputGroup>
