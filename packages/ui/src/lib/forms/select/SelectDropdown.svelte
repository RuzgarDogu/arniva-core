<script>
    /** @import { Component } from 'svelte' */
    import Dropdown from "../../general/Dropdown.svelte";
    import DropdownContent from "../../general/DropdownContent.svelte";
    import Button from "../../general/Button.svelte";
    import Input from "../../forms/Input.svelte";

    /**
     * @typedef {Object} SelectOption
     * @property {number|string} id - Unique identifier for the option
     * @property {string} name - Display text for the option
     */

    /**
     * @typedef {Object<string, any>} Props
     * @property {string} class
     * @property {boolean} disabled
     * @property {'small' | 'medium' | 'large'} size
     * @property {string} placeholder
     * @property {any} rest
     * @property {SelectOption[]} data - Array of options for the dropdown/select
     */


    /** @type {Props} */
    let { class: cls = '', data=[], onSelect, placeholder='', ...rest } = $props();

    /** @type {string} */
    let searchText = $state('');
    
    /** @type {SelectOption[]} */
    let filteredData = $state(data);
    
    /** @type {import('../../general/Dropdown.svelte').default | null} */
    let searchDropdown = null;
    
    /** @type {number|string|null} */
    let focusedItemId = $state(null);

    /**
     * Updates the search text and shows dropdown
     * @param {Event} event - Input event
     */
    function handleInput(event) {
        if (!searchDropdown) return;
        searchDropdown.show();

        /** @type {HTMLInputElement} */
        const target = /** @type {HTMLInputElement} */ (event.target);
        searchText = target?.value || '';
    }

    $effect(() => {
        if (!searchText.trim()) {
            filteredData = data
            return
        };

        const searchTerms = searchText.toLowerCase().split(/\s+/).filter(term => term.length > 0);

        filteredData = data.filter(/** @param {SelectOption} item */ item => {
            const itemName = item.name.toLowerCase();
            // Check if all search terms appear somewhere in the item name
            return searchTerms.every(term => itemName.includes(term));
        });
    });

    /**
     * Handles selection of an item
     * @param {SelectOption} item - The selected item
     */
    function select(item) {
        onSelect && onSelect(item);
        searchText = item.name
        if (searchDropdown) searchDropdown.hide();
    }
    
    /**
     * Keyboard navigation action
     * @param {HTMLElement} node - The element to attach keyboard navigation to
     * @returns {object} - Action cleanup handlers
     */
    function keyboardNav(node) {
        /** @type {number} */
        let currentIndex = -1;
        
        /**
         * Handles keyboard events for navigation
         * @param {KeyboardEvent} event - The keyboard event
         */
        function handleKeydown(event) {
            if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
                event.preventDefault();
                
                // Only navigate when we have items in the dropdown
                if (filteredData.length === 0) return;
                
                if (event.key === 'ArrowDown') {
                    // Move down through the list
                    if (currentIndex < filteredData.length - 1) {
                        currentIndex++;
                    }
                } else {
                    // Move up through the list
                    if (currentIndex > -1) {
                        currentIndex--;
                    }
                }
                
                // Update focusedItemId based on the current index
                focusedItemId = currentIndex >= 0 ? filteredData[currentIndex].id : null;
            } else if ((event.key === 'Enter' || event.key === 'Tab') && focusedItemId !== null) {
                // Select the currently focused item on Enter
                event.preventDefault();
                const focusedItem = filteredData.find(item => item.id === focusedItemId);
                if (focusedItem) {
                    select(focusedItem);
                }
            }
            if (event.key === 'Escape') {
                if(searchDropdown) searchDropdown.hide();
                
                // Check if any item is selected (this assumes the searchText would match exactly one item's name)
                const isItemSelected = data.some(/** @param {SelectOption} item */ item => item.name === searchText);
                
                // Reset all variables if no item is selected
                if (!isItemSelected) {
                    searchText = '';
                    focusedItemId = null;
                    currentIndex = -1;
                }
            }
        }
        
        node.addEventListener('keydown', handleKeydown);
        


        return {
            destroy() {
                node.removeEventListener('keydown', handleKeydown);
            }
        };
    }


    /**
     * Handles dropdown state changes
     * @param {boolean} isOpen - Whether the dropdown is open
     */
    function checkDropdown(isOpen) {
        // When dropdown is closed (isOpen is false)
        if (!isOpen) {
            // Check if any item is selected by comparing searchText with item names
            const isItemSelected = data.some(/** @param {SelectOption} item */ item => item.name === searchText);
            
            // If no item is selected, reset the search text
            if (!isItemSelected) {
                searchText = '';
                focusedItemId = null;
            }
        }
    }

</script>
<div class={['form-select--searh', cls].join(' ')} use:keyboardNav {...rest}>
    <Dropdown class="form-select--search--dropdown" fullWidth bind:this={searchDropdown} onChange={checkDropdown}>
        <Input dropdown oninput={handleInput} value={searchText} {placeholder}/>
        <DropdownContent>
                {#each filteredData as item}
                <Button class={focusedItemId && item.id === focusedItemId ? 'focused' : ''}
                    onClick={() => select(item)}>{item?.name || ''}</Button>
                {:else}
                <p>No results found</p>
                {/each}
        </DropdownContent>
    </Dropdown>
</div>