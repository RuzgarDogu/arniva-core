<script>
    import Dropdown from "../../general/Dropdown.svelte";
    import DropdownContent from "../../general/DropdownContent.svelte";
    import { onMount } from 'svelte';

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
     * @property {any} rest
     * @property {SelectOption[]} data - Array of options for the dropdown/select
     */


    /** @type {Props} */
    let { class: cls = '', data=[], onSelect, ...rest } = $props();

    let searchText = $state('');
    let lookaheadText = $state('');
    let editableDiv;
    let isUserTyping = false;
    let dropdown;

    // Filter data based on search text
    let filteredData = $derived.by(() => {
        if (!searchText.trim()) return data;
        
        const searchTerms = searchText.toLowerCase().split(/\s+/).filter(term => term.length > 0);
        
        return data.filter(item => {
            const itemName = item.name.toLowerCase();
            
            // Check if all search terms appear somewhere in the item name
            return searchTerms.every(term => itemName.includes(term));
        });
    });

    // Calculate lookahead suggestion based on filtered data
    $effect(() => {
        if (!searchText.trim() || filteredData.length === 0) {
            lookaheadText = '';
            return;
        }
        
        // Get the first match as suggestion
        const suggestion = filteredData[0].name;
        const searchLower = searchText.toLowerCase().trim();
        const suggestionLower = suggestion.toLowerCase();
        
        // If search and suggestion are identical (ignoring case), don't show lookahead
        if (searchLower === suggestionLower) {
            lookaheadText = '';
            return;
        }
        
        // If search is just the start of the suggestion, show lookahead
        if (suggestionLower.startsWith(searchLower)) {
            lookaheadText = suggestion;
            return;
        }
        
        // No lookahead available
        lookaheadText = '';
    });

    function handleOpen(event) {
        // Dropdown opened/closed event handler
    }

    /**
     * @param {Event} event
     */
    function handleInput(event) {
        if (!event || !event.target) return;
        isUserTyping = true;
        
        // Remove any line breaks from the content
        let text = /** @type {HTMLElement} */(event.target).innerText;
        text = text.replace(/\n/g, '');
        
        // Update state
        searchText = text;
        
        // If text was modified, update the element
        if (text !== /** @type {HTMLElement} */(event.target).innerText) {
            /** @type {HTMLElement} */(event.target).innerText = text;
        }
        
        isUserTyping = false;
        dropdown?.show();
    }

    function selectItem(item) {
        searchText = item.name;
        lookaheadText = '';
        if (editableDiv) {
            editableDiv.innerText = item.name;
            // After selection, focus on the editable div
            editableDiv.focus();
            // Place cursor at the end
            placeCaretAtEnd(editableDiv);
        }
        onSelect && onSelect(item);
        if(dropdown) {
            dropdown.hide();
        }
    }

    /**
     * Places caret at the end of the specified element
     * @param {HTMLElement} el - Element to place caret in
     */
    function placeCaretAtEnd(el) {
        if (!el) return;
        
        const range = document.createRange();
        const selection = window.getSelection();
        
        if (!selection) return;

        range.selectNodeContents(el);
        range.collapse(false); // collapse to end
        
        selection.removeAllRanges();
        selection.addRange(range);
    }

    onMount(() => {
        if (editableDiv) {
            editableDiv.innerText = searchText;
        }
    });

    /**
     * Completes the current input with the lookahead suggestion
     */
    function completeLookahead() {
        if (!lookaheadText) return;
        
        searchText = lookaheadText;
        lookaheadText = '';
        
        if (editableDiv) {
            editableDiv.innerText = searchText;
            editableDiv.focus();
            placeCaretAtEnd(editableDiv);
        }
    }

    /**
     * Handle paste events to prevent multi-line pastes
     * @param {ClipboardEvent} event
     */
    function handlePaste(event) {
        event.preventDefault();
        
        // Get text from clipboard
        const text = event.clipboardData?.getData('text/plain');
        
        if (text) {
            // Remove line breaks
            const cleanText = text.replace(/\n/g, '');
            
            // Insert at cursor position
            document.execCommand('insertText', false, cleanText);
        }
    }

    /**
     * Handle key presses to prevent new lines and handle tab completion
     * @param {KeyboardEvent} event
     */
    function handleKeyDown(event) {
        // Prevent Enter from creating a new line
        if (event.key === 'Enter') {
            event.preventDefault();
            
            // If lookahead available, complete it on Enter
            if (lookaheadText) {
                completeLookahead();
            } else if (filteredData.length > 0) {
                // Select the first item in the filtered data list
                selectItem(filteredData[0]);
            } else {
                // If no items to select, just hide dropdown
                dropdown?.hide();
            }
        }
        
        // Handle Tab for lookahead completion
        if (event.key === 'Tab' && lookaheadText) {
            event.preventDefault();
            completeLookahead();
        }
        
        // Arrow key navigation in the dropdown
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            // Make sure dropdown is shown
            dropdown?.show();
        }
    }
</script>

<div class="select-dropdown-container">
    <Dropdown class="form-select--search {cls}"
    bind:this={dropdown}
    onChange={handleOpen}
    fullWidth
    {...rest}
    >
        <div class="input-container">
            <div bind:this={editableDiv} 
                class="button--dropdown single-line" 
                contenteditable="true" 
                on:input={handleInput}
                on:keydown={handleKeyDown}
                on:paste={handlePaste}
                role="textbox"
                aria-label="Search options"
            ></div>
            {#if lookaheadText && searchText && lookaheadText.toLowerCase() !== searchText.toLowerCase()}
                <div class="lookahead-suggestion">
                    <span class="typed-part">{searchText}</span>
                    <span class="suggestion-part">{lookaheadText.slice(searchText.length)}</span>
                </div>
            {/if}
        </div>
        <DropdownContent>
            <ul>
                {#each filteredData as item}
                    <li on:click={() => selectItem(item)}>{item.name}</li>
                {/each}
            </ul>
        </DropdownContent>
    </Dropdown>
</div>

<style>
    .select-dropdown-container {
        position: relative;
    }
    
    .input-container {
        position: relative;
    }
    
    .lookahead-suggestion {
        position: absolute;
        top: 0;
        left: 0;
        pointer-events: none;
        width: 100%;
        padding: inherit;
        box-sizing: border-box;
    }
    
    .typed-part {
        visibility: hidden;
    }
    
    .suggestion-part {
        opacity: 0.5;
    }
    
    .button--dropdown {
        background: transparent;
        position: relative;
        z-index: 1;
    }
    
    .single-line {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        display: inline-block;
        width: 100%;
    }
</style>