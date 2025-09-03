<script>
	import Dropdown from '../../general/Dropdown.svelte';
	import DropdownContent from '../../general/DropdownContent.svelte';
	import Button from '../../general/Button.svelte';
	import Input from '../../forms/Input.svelte';
	import { Icon } from '$lib';
	/**
	 * @typedef {{ id: number|string, [key: string]: any }} SelectOption
	 */

	/**
	 * @typedef {Object<string, any>} Props
	 * @property {string} class
	 * @property {boolean} disabled
	 * @property {'small' | 'medium' | 'large'} size
	 * @property {string} placeholder
	 * @property {any} rest
	 * @property {string} nameKey - Key to use for the option name
	 * @property {() => void} onSelect - Callback function when an option is selected
	 * @property {() => void} [onInput] - Callback function when the search input changes
	 * @property {string} value - Selected value
	 * @property {SelectOption[]|string[]} data - Array of options for the dropdown/select
	 * @property {boolean} serverSide - Whether searching is handled by the server
	 * @property {boolean} insertable - Whether new items can be added by typing
	 */

	/** @type {Props} */
	let {
		class: cls = '',
		nameKey = 'name',
		value = $bindable(),
		data = $bindable([]),
		onSelect,
		onInput,
		placeholder = '',
		serverSide = false,
		disabled = false,
		insertable = false,
		...rest
	} = $props();

	/** @type {string} */
	let searchText = $state('');

	/** @type {SelectOption[]} */
	let filteredData = $state([]);

	/** @type {import('../../general/Dropdown.svelte').default | null} */
	let searchDropdown = null;

	/** @type {number|string|null} */
	let focusedItemId = $state(null);

	/** @type {boolean} */
	let isUserEditing = $state(false);

	/** @type {boolean} */
	let isStringArray = $state(false);

	/** @type {SelectOption[]} */
	let normalizedData = $state([]);

	/** @type {string|null} */
	let lastAddedItem = $state(null);

	// Normalize data to handle both string arrays and object arrays
	$effect(() => {
		if (data.length === 0) {
			normalizedData = [];
			isStringArray = false;
			return;
		}

		// Check if data is a string array
		isStringArray = typeof data[0] === 'string';

		if (isStringArray) {
			normalizedData = data.map(
				/** @param {string} item */ (item) => {
					// Add defensive check for null/undefined items
					if (item == null) {
						console.warn('Found null/undefined item in string array:', item);
						return { id: '', [nameKey]: '' };
					}
					return {
						id: item,
						[nameKey]: item
					};
				}
			);
		} else {
			normalizedData = [...data];
		}
	});

	// Check if initial value exists in data for insertable components
	$effect(() => {
		if (insertable && isStringArray && value && typeof value === 'string') {
			const valueExists = data.some(/** @param {string} item */ (item) => item === value);
			if (!valueExists) {
				data = [...data, value];
			}
		}
	});

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

		// Handle insertable functionality
		if (insertable && isStringArray) {
			if (searchText.trim()) {
				handleInsertableInput();
			} else if (lastAddedItem !== null) {
				// Remove the last added item if search text is empty

				data = data.filter(/** @param {string} item */ (item) => item !== lastAddedItem);
				lastAddedItem = null;
			}
		}

		// When using server-side search, we need to call onInput
		// to let the parent component fetch new results
		if (onInput) {
			onInput(searchText);
		}

		// In server-side mode, handle text deletion specially
		if (serverSide && searchText === '') {
			value = null;
			// For insertable components, don't call onSelect with null to avoid adding empty values
			if (onSelect && (!insertable || !isStringArray)) {
				onSelect(null);
			}
			focusedItemId = null;
			return;
		}

		// Only perform client-side filtering when not in server-side mode
		updateFilteredData();
	}

	/**
	 * Handles insertable input - adds or updates the current typing item
	 */
	function handleInsertableInput() {
		if (!searchText.trim()) return;

		// Remove the last added item if it exists
		if (lastAddedItem !== null) {
			data = data.filter(/** @param {string} item */ (item) => item !== lastAddedItem);
		}

		// Check if the current search text already exists in the original data
		const existsInOriginal = data.some(
			/** @param {string|SelectOption} item */ (item) =>
				typeof item === 'string' ? item.toLowerCase() === searchText.toLowerCase() : false
		);

		// Only add if it doesn't exist in the original data
		if (!existsInOriginal) {
			data = [...data, searchText];
			lastAddedItem = searchText;
		} else {
			lastAddedItem = null;
		}
	}

	// Modify the effect that watches data changes
	$effect(() => {
		// For both client and server-side mode, apply filtering to the data
		// when it changes - this ensures we maintain filtering on new data
		if (searchText.trim()) {
			updateFilteredData();
		} else {
			filteredData = normalizedData;
		}
	});

	// Override the automatic text updating when value changes
	$effect(() => {
		if (!isUserEditing && value && normalizedData.length > 0) {
			// Find item that matches the value (ID)
			const foundItem = normalizedData.find(
				/** @param {SelectOption} item */ (item) => item.id === value
			);
			if (foundItem) {
				// Set the searchText to the name of the selected item
				searchText = foundItem[nameKey];
			}
		} else if (value === null && !isUserEditing) {
			// Reset search text if value is null and user is not editing
			searchText = '';
		}
	});

	// Update the updateFilteredData function to work in both modes
	function updateFilteredData() {
		if (!searchText.trim()) {
			filteredData = normalizedData;
			return;
		}

		const searchTerms = searchText
			.toLowerCase()
			.split(/\s+/)
			.filter(/** @param {string} term */ (term) => term.length > 0)
			.map(normalizeText);

		filteredData = normalizedData.filter(
			/** @param {SelectOption} item */ (item) => {
				// Add defensive check for item and item[nameKey]
				if (!item || item[nameKey] == null) {
					console.warn('Item or item[nameKey] is null/undefined:', item);
					return false;
				}

				const normalizedItemName = normalizeText(item[nameKey]);
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
		// Add defensive check for null/undefined values
		if (text == null) {
			console.warn('normalizeText received null/undefined text:', text);
			return '';
		}

		// Ensure text is a string
		const textStr = String(text);

		// Handle specific Turkish characters
		return textStr
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
		if (isStringArray) {
			value = item[nameKey]; // For string arrays, value should be the string itself
			// Only call onSelect if the value is not empty/null
			if (onSelect && item[nameKey] && item[nameKey].trim()) {
				onSelect(item[nameKey]);
			}
		} else {
			value = item.id;
			if (onSelect) {
				onSelect(item);
			}
		}
		searchText = item[nameKey];
		isUserEditing = false; // User has selected an item, so they're no longer editing
		lastAddedItem = null; // Reset the last added item since user selected something

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
			// Only handle keyboard events when we're focused on the input element
			const isInputElement =
				event.target && /** @type {HTMLElement} */ (event.target).tagName === 'INPUT';

			// If we're not on the input element, let all keys work normally
			if (!isInputElement) {
				return;
			}

			if (event.key === 'Tab') {
				// Case 1: If there's a focused item in the dropdown, select it and prevent Tab
				if (focusedItemId !== null) {
					event.preventDefault();
					const focusedItem = filteredData.find((item) => item.id === focusedItemId);
					if (focusedItem) {
						select(focusedItem);
					}
					return;
				}

				// Case 2: For insertable components with typed text
				if (insertable && isStringArray && searchText.trim()) {
					// Check if the current search text is different from the selected value
					const isDifferentFromSelected = searchText !== value;

					// Accept typed text if it's different from the current selection
					if (isDifferentFromSelected) {
						event.preventDefault();

						value = searchText;
						// Only call onSelect if the text is not empty
						if (onSelect && searchText.trim()) {
							onSelect(searchText);
						}
						isUserEditing = false;
						if (searchDropdown) searchDropdown.hide();
						return;
					}
				}

				// For all other cases (regular selects, valid selections, etc.),
				// close dropdown and let Tab work normally
				if (searchDropdown) {
					searchDropdown.hide();
				}
				// Don't preventDefault - let Tab work normally for focus navigation
			}

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
			} else if (event.key === 'Enter') {
				event.preventDefault();

				// If there's a focused item, select it
				if (focusedItemId !== null) {
					const focusedItem = filteredData.find((item) => item.id === focusedItemId);
					if (focusedItem) {
						select(focusedItem);
						return;
					}
				}

				// For insertable functionality, if there's text and no focused item,
				// accept the typed text as the selection
				if (insertable && isStringArray && searchText.trim()) {
					value = searchText;
					// Only call onSelect if the text is not empty
					if (onSelect && searchText.trim()) {
						onSelect(searchText);
					}
					isUserEditing = false;
					if (searchDropdown) searchDropdown.hide();
				}
			} else if (event.key === 'Escape') {
				if (searchDropdown) searchDropdown.hide();

				// Check if any item is selected (this assumes the searchText would match exactly one item's name)
				const isItemSelected = normalizedData.some(
					/** @param {SelectOption} item */ (item) => item[nameKey] === searchText
				);

				// Reset all variables if no item is selected
				if (!isItemSelected) {
					// Remove the last added item if it exists and wasn't selected
					if (insertable && isStringArray && lastAddedItem !== null) {
						data = data.filter(/** @param {string} item */ (item) => item !== lastAddedItem);
						lastAddedItem = null;
					}
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
			const isItemSelected = normalizedData.some(
				/** @param {SelectOption} item */ (item) => item[nameKey] === searchText
			);

			// For insertable functionality, handle typed text when dropdown closes
			if (insertable && isStringArray && searchText.trim()) {
				if (!isItemSelected) {
					// User typed something new - accept it as the selection

					value = searchText;
					// Only call onSelect if the text is not empty
					if (onSelect && searchText.trim()) {
						onSelect(searchText);
					}

					// Ensure the typed text is in the data array (only if not empty)
					if (searchText.trim()) {
						const existsInData = data.some(
							/** @param {string} item */ (item) => item === searchText
						);
						if (!existsInData) {
							data = [...data, searchText];
						}
					}
					lastAddedItem = null; // Reset since we've accepted the item
					return;
				} else {
					// Item exists in data - make sure it's properly selected
					const matchingItem = normalizedData.find(
						/** @param {SelectOption} item */ (item) => item[nameKey] === searchText
					);
					if (matchingItem) {
						value = matchingItem.id;
						onSelect && onSelect(isStringArray ? matchingItem[nameKey] : matchingItem);
					}
					return;
				}
			}

			// If no item is selected and not insertable, reset everything
			if (!isItemSelected) {
				// Remove the last added item if it exists and wasn't selected
				if (insertable && isStringArray && lastAddedItem !== null) {
					data = data.filter(/** @param {string} item */ (item) => item !== lastAddedItem);
					lastAddedItem = null;
				}
				searchText = '';
				focusedItemId = null;
				value = null;
			}
		}
	}

	function clearSearch() {
		// Remove the last added item if it exists
		if (insertable && isStringArray && lastAddedItem !== null) {
			data = data.filter(/** @param {string} item */ (item) => item !== lastAddedItem);
			lastAddedItem = null;
		}

		searchText = '';
		value = null;
		focusedItemId = null;
		isUserEditing = false; // Reset editing flag when search is cleared

		// Only call onSelect if it's not an insertable component or if we want to notify about clearing
		// For insertable components, we don't want to add empty values to the data
		if (onSelect && (!insertable || !isStringArray)) {
			onSelect(null);
		}

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
			<Input
				{disabled}
				dropdown
				oninput={handleInput}
				bind:value={searchText}
				{placeholder}
				{...rest}
			/>
			{#if !searchText}
				<Button
					class="dropdown-button {searchText ? '' : 'active'}"
					square
					dropdown
					color="transparent"
					tabindex={-1}
					onClick={() => searchDropdown?.show()}
				>
					<Icon icon="mdi:chevron-down" width="24" height="24" />
				</Button>
			{:else if !disabled}
				<Button
					class="clear-button {searchText ? 'active' : ''}"
					square
					color="transparent"
					tabindex={-1}
					onClick={clearSearch}
					{disabled}
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
			{/if}
		</div>
		<DropdownContent>
			{#each filteredData as item}
				<Button
					class={focusedItemId && item.id === focusedItemId ? 'focused' : ''}
					tabindex={-1}
					onClick={() => select(item)}>{item?.[nameKey] || ''}</Button
				>
			{:else}
				<p>No results found</p>
			{/each}
		</DropdownContent>
	</Dropdown>
</div>
