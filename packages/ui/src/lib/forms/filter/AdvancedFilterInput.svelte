<script>
    import Input from '../Input.svelte';
    import Dropdown from '../../general/Dropdown.svelte';
    import DropdownContent from '../../general/DropdownContent.svelte';
    import Button from '../../general/Button.svelte';
    import Icon from '../../icons/Icon.svelte';

    /**
     * @typedef {Object} Column
     * @property {string} value - The column value/identifier
     * @property {string} [label] - Display text for the column (optional)
     * @property {string|number} [id] - Optional unique identifier
     */

    /**
     * @typedef {Object} ColumnSearch
     * @property {string} column - The column to search in
     * @property {string} value - The search term/value
     */

    /** @type {{onSelect: (data: ColumnSearch) => void, columns: Column[], resetTrigger: Number}} */
    let { onSelect, columns, resetTrigger = 0 } = $props();
    
    // Always select first column as default
    let selectedColumn = $state(columns[0]);
    let searchText = $state('');

    /** @type {import('../../general/Dropdown.svelte').default | null} */
    let searchDropdown = null;
    let focusedIndex = $state(-1);


    /**
     * Send search parameters to the parent component
     * @param {ColumnSearch} d - The search parameters
     */
     function sendToMain(d) {
        // Send the selected column and search text to the main component
        if (onSelect) {
            onSelect(d);
        }
    }

    /**
     * Handle input events on the search field
     * @param {KeyboardEvent} event - The keyboard event
     */
    function handleInput(event) {
        // When Enter is pressed in the input
        if (event.key === 'Enter') {
            // If we have a focused item in dropdown, don't process here (let keyboardNav handle it)
            if (focusedIndex !== -1 && columns.length > 1) {
                return;
            }
            
            // Always call onSelect with the current column and searchText
            sendToMain({
                column: selectedColumn.value,
                value: searchText,
            });
            
            if (searchDropdown) searchDropdown.hide();
        } 
        // When backspace is pressed and input becomes empty
        else if (
            (event.key === 'Backspace' || event.key === 'Delete') && 
            searchText === ''
        ) {
            // Send null to parent component to clear the filter
            onSelect && onSelect({
                column: selectedColumn.value,
                value: '',
            });
        } else if (
            (event.key === 'Backspace' && (event.altKey || event.metaKey)) || 
            (event.key === 'Delete' && (event.altKey || event.metaKey))
        ) {
            // Handle Alt+Backspace, Command+Backspace, Alt+Delete, or Command+Delete to clear the filter
            searchText = ''; // Clear the input text
            onSelect && onSelect({
                column: selectedColumn.value,
                value: '',
            });
        }
    }


    /**
     * Keyboard navigation action
     * @param {HTMLElement} node - The element to attach keyboard navigation to
     * @returns {object} - Action cleanup handlers
     */
    function keyboardNav(node) {
        /**
         * Handles keyboard events for navigation
         * @param {KeyboardEvent} event - The keyboard event
         */
        function handleKeydown(event) {
            // Only handle dropdown navigation if there are multiple columns
            if (columns.length <= 1 || !searchDropdown) return; 

            if (event.key === 'ArrowDown') {
                event.preventDefault();
                searchDropdown.show();
                focusedIndex = focusedIndex < columns.length - 1 ? focusedIndex + 1 : focusedIndex;
            } else if (event.key === 'ArrowUp') {
                event.preventDefault();
                searchDropdown.show();
                focusedIndex = focusedIndex > 0 ? focusedIndex - 1 : focusedIndex;
            } else if (event.key === 'Enter' && focusedIndex !== -1) {
                event.preventDefault();
                changeColumn(columns[focusedIndex]);
                focusedIndex = -1;
            } else if (event.key === 'Escape') {
                focusedIndex = -1;
                searchDropdown.hide();
                searchText = '';
            } else if (event.key === 'Tab' && focusedIndex !== -1) {
                event.preventDefault();
                changeColumn(columns[focusedIndex]);
                focusedIndex = -1;
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
     * Changes the selected column and triggers the search
     * @param {Column} column - The column to select
     */
    function changeColumn(column) {
        selectedColumn = column;
        sendToMain({
            column: selectedColumn.value,
            value: searchText,
        });
        searchDropdown && searchDropdown.hide();
        focusedIndex = -1;
    }

    /**
     * Handles dropdown state changes
     * @param {boolean} isOpen - Whether the dropdown is open
     */
    function checkDropdown(isOpen) {
        if (!isOpen) {
            // Reset focus index when dropdown closes
            focusedIndex = -1;
        }
    }

    // Add effect to watch resetTrigger changes
    $effect(() => {
        if (resetTrigger > 0) {
            // Reset input state
            searchText = '';
            // Ensure we reset to the first column if available
            if (columns.length > 0) {
                selectedColumn = columns[0];
            }
            focusedIndex = -1;
        }
    });


</script>

<div class="filter-input" use:keyboardNav>
    <Dropdown
        class="form-select--search--dropdown"
        fullWidth
        bind:this={searchDropdown}
        onChange={checkDropdown}
    >
        <!-- Simplified input handling -->
        <Input 
            bind:value={searchText} 
            dropdown 
            onkeydown={handleInput} />

        <!-- Only show dropdown content if there are multiple columns to choose from -->
        {#if columns.length > 1}
            <DropdownContent>
                {#each columns as column, index (column?.id || index)}
                <Button 
                    class="filter-input--column {index === focusedIndex ? 'focused' : ''}" 
                    onClick={() => changeColumn(column)}>
                    {column.label || column.value}
                    {#if column.value === selectedColumn.value}
                        <Icon icon="mdi:check-bold" width="14" height="14" />
                    {/if}
                </Button>
                {/each}
            </DropdownContent>
        {/if}
    </Dropdown>
</div>