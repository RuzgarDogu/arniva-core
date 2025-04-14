<script>
	/** @import { Component } from 'svelte' */
	import Dropdown from '../../general/Dropdown.svelte';
	import DropdownContent from '../../general/DropdownContent.svelte';
	import Button from '../../general/Button.svelte';
	import Input from '../../forms/Input.svelte';

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
	 * @property {() => void} onSelect - Callback function when an option is selected
	 * @property {() => void} [onInput] - Callback function when the search input changes
	 * @property {string} value - Selected value
	 * @property {SelectOption[]} data - Array of options for the dropdown/select
	 * @property {boolean} serverSide - Whether searching is handled by the server
	 */

	/** @type {Props} */
	let { 
		class: cls = '', 
		value = $bindable(), 
		data = [], 
		onSelect, 
		onInput, 
		placeholder = '', 
		serverSide = false, 
		...rest 
	} = $props();

	/** @type {string} */
	let searchText = $state('');

	/** @type {SelectOption[]} */
	let filteredData = $state(data);

	/** @type {import('../../general/Dropdown.svelte').default | null} */
	let searchDropdown = null;

	/** @type {number|string|null} */
	let focusedItemId = $state(null);

	/** @type {boolean} */
	let isUserEditing = $state(false);

	/**
	 * Updates the search text and shows dropdown
	 * @param {Event} event - Input event
	 */
	function handleInput(event) {
		if (!searchDropdown) return;
		searchDropdown.show();

		/** @type {HTMLInputElement} */
		const target = /** @type {HTMLInputElement} */ (event.target);
		const newSearchText = target?.value || '';
		
		// Set the flag indicating user is editing
		isUserEditing = true;
		
		// Update searchText with user input
		searchText = newSearchText;
		
		// When using server-side search, we need to call onInput
		// to let the parent component fetch new results
		if (onInput) {
			onInput(searchText);
		}
		
		// In server-side mode, handle text deletion specially
		if (serverSide && searchText === '') {
			value = null;
			onSelect && onSelect(null);
			focusedItemId = null;
			return;
		}
		
		// Only perform client-side filtering when not in server-side mode
		if (!serverSide) {
			updateFilteredData();
		}
	}

	// Override the automatic text updating when value changes
	$effect(() => {
		if (!isUserEditing && value && data.length > 0) {
			// Find item that matches the value (ID)
			const foundItem = data.find(
				/** @param {SelectOption} item */ (item) => item.id === value
			);
			if (foundItem) {
				// Set the searchText to the name of the selected item
				searchText = foundItem.name;
			}
		} else if (value === null && !isUserEditing) {
			// Reset search text if value is null and user is not editing
			searchText = '';
		}
	});

	$effect(() => {
		// In server-side mode, we should always just use the data directly
		// without trying to filter it
		if (serverSide) {
			filteredData = data;
			return;
		}
		
		// Set filtered data to match provided data when the data changes
		filteredData = data;
	});

	/**
	 * Updates the filtered data based on the search text
	 */
	function updateFilteredData() {
		if (!searchText.trim()) {
			filteredData = data;
			return;
		}

		const searchTerms = searchText
			.toLowerCase()
			.split(/\s+/)
			.filter((term) => term.length > 0)
			.map(normalizeText);

		filteredData = data.filter(
			/** @param {SelectOption} item */ (item) => {
				const normalizedItemName = normalizeText(item.name);
				// Check if all search terms appear somewhere in the normalized item name
				return searchTerms.every((term) => normalizedItemName.includes(term));
			}
		);
	}

	/**
	 * Normalizes text for search by converting Turkish characters to their ASCII equivalents
	 * and removing diacritics for better matching
	 * @param {string} text - The text to normalize
	 * @return {string} Normalized text
	 */
	function normalizeText(text) {
		// Handle specific Turkish characters
		return text
			.toLowerCase()
			.normalize('NFD')
			.replace(/[\u0130]/g, 'i') // İ -> i
			.replace(/[\u0131]/g, 'i') // ı -> i
			.replace(/[\u00e7]/g, 'c') // ç -> c
			.replace(/[\u011f]/g, 'g') // ğ -> g
			.replace(/[\u00f6]/g, 'o') // ö -> o
			.replace(/[\u015f]/g, 's') // ş -> s
			.replace(/[\u00fc]/g, 'u') // ü -> u
			.replace(/[\u0307]/g, '') // remove dot above
			.replace(/[\u0308]/g, '') // remove diaeresis
			.replace(/[\u0327]/g, '') // remove cedilla
			.replace(/[\u0306]/g, '') // remove breve (for ğ)
			.replace(/[^\w\s]/gi, '') // remove other diacritics
			.trim();
	}

	/**
	 * Handles selection of an item
	 * @param {SelectOption} item - The selected item
	 */
	function select(item) {
		value = item.id;
		onSelect && onSelect(item);
		searchText = item.name;
		isUserEditing = false; // User has selected an item, so they're no longer editing
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
				const focusedItem = filteredData.find((item) => item.id === focusedItemId);
				if (focusedItem) {
					select(focusedItem);
				}
			}
			if (event.key === 'Escape') {
				if (searchDropdown) searchDropdown.hide();

				// Check if any item is selected (this assumes the searchText would match exactly one item's name)
				const isItemSelected = data.some(
					/** @param {SelectOption} item */ (item) => item.name === searchText
				);

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
			 // Reset the editing flag when dropdown closes
			isUserEditing = false;

			// When using server-side search, we don't want to auto-select
			// an item just because it's the only one in the list
			if (serverSide) {
				// Don't reset searchText in server-side mode when dropdown closes
				// Only reset other state if no item is actually selected
				if (value === null) {
					focusedItemId = null;
				}
				return;
			}

			// If using client-side search, check if any item matches
			// Check if any item is selected by comparing searchText with item names
			const isItemSelected = data.some(
				/** @param {SelectOption} item */ (item) => item.name === searchText
			);

			// If no item is selected, reset the search text
			if (!isItemSelected) {
				searchText = '';
				focusedItemId = null;
				value = null;
			}
		}
	}

	function clearSearch() {
		searchText = '';
		value = null;
		onSelect && onSelect(null);
		focusedItemId = null;
		isUserEditing = false; // Reset editing flag when search is cleared
		
		// In server-side mode, also trigger the onInput callback with empty string
		// to ensure the parent component knows the search was cleared
		if (serverSide && onInput) {
			onInput('');
		}
		
		// Give focus back to the input
		/** @type {HTMLInputElement|null} */
		const inputElement = document.querySelector('.form-select--search input');
		if (inputElement) {
			inputElement.focus();
		}
	}
</script>

<div class={['form-select--search', cls].join(' ')} use:keyboardNav {...rest}>
	<Dropdown
		class="form-select--search--dropdown"
		fullWidth
		bind:this={searchDropdown}
		onChange={checkDropdown}
	>
		<div class="form-select--search--container">
			<Input dropdown oninput={handleInput} bind:value={searchText} {placeholder} />
			<Button
				class="clear-button {searchText ? 'active' : ''}"
				square
				color="transparent"
				onClick={clearSearch}
			>
				<svg
					width="14px"
					height="14px"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
						id="SVGRepo_tracerCarrier"
						stroke-linecap="round"
						stroke-linejoin="round"
					></g><g id="SVGRepo_iconCarrier">
						<circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="1.5"></circle>
						<path
							d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecap="round"
						></path>
					</g></svg
				>
			</Button>
		</div>
		<DropdownContent>
			{#each filteredData as item}
				<Button
					class={focusedItemId && item.id === focusedItemId ? 'focused' : ''}
					onClick={() => select(item)}>{item?.name || ''}</Button
				>
			{:else}
				<p>No results found</p>
			{/each}
		</DropdownContent>
	</Dropdown>
</div>
