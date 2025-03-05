<script>
    import Dropdown from "../../general/Dropdown.svelte";
    import Button from "../../general/Button.svelte";
    import DropdownContent from "../../general/DropdownContent.svelte";
    import Input from "../Input.svelte";
    import InputGroup from "../InputGroup.svelte";
    import Icon from "../../icons/Icon.svelte";

    import { onMount } from "svelte";

    let { filterConfig } = $props();

    let fields = $state(filterConfig.fields.map(field => {
        return {
            ...field,
            value: '',
            isOpen: false
        }
    }));

    $inspect("fields", fields);

    // Use an object to store dropdown references
    let fieldDropdown = $state({});
    let filterDropdown = $state({});

    // Function to toggle filter visibility
    function toggleFieldDropdown(field) {
        console.log(`Toggling dropdown for ${field.name}`);
        
        // Toggle the isOpen state
        let _field = fields.find(f => f.name === field.name);
        _field.isOpen = !_field.isOpen;
        
        // Ensure next tick to allow rendering
        setTimeout(() => {
            // Get the dropdown reference (after the state has been updated)
            let dd = fieldDropdown[field.name];
            console.log("Dropdown reference:", dd);
            
            if (dd && _field.isOpen) {
                console.log("Attempting to show dropdown");
                dd.show();
                filterDropdown.hide();
            } else if (dd && !_field.isOpen) {
                console.log("Attempting to hide dropdown");
                dd.hide();
            } else {
                console.log("Dropdown reference not found");
            }
        }, 10);
    }

    // Function to handle checkbox changes
    function handleCheckboxChange(field) {
        toggleFieldDropdown(field);
    }
</script>

<InputGroup style="margin-bottom: 30px;">
    <Dropdown bind:this={filterDropdown}>
        <Button dropdown size="small" square color="transparent">
            <Icon name="filter" size="18px"/>
            Filter
        </Button>
        <DropdownContent>
            {#each fields as field}
                <div class="filter-checkbox-item">
                    <label>
                        <input 
                            type="checkbox" 
                            checked={field.isOpen} 
                            on:change={() => handleCheckboxChange(field)} 
                        />
                        <span>{field.label}</span>
                    </label>
                </div>
            {/each}
        </DropdownContent>
    </Dropdown>

    {#each fields as field (field.name)}
        <!-- Use a wrapper to ensure stable positioning -->
        {#if field.isOpen}
        <div style="position: relative; display: inline-block;">
            <Dropdown bind:this={fieldDropdown[field.name]}>
                <Button dropdown size="small" square color="transparent">
                    {field.label}
                </Button>
                <DropdownContent>
                    Dropdown content for {field.label}
                </DropdownContent>
            </Dropdown>
        </div>
        {/if}
    {/each}

    <Input />
</InputGroup>

<style>
    .filter-checkbox-item {
        padding: 8px 16px;
        cursor: pointer;
    }

    .filter-checkbox-item:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }

    .filter-checkbox-item label {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;
        width: 100%;
    }
</style>