<script>
	import Radio from '../Radio.svelte';
	import Checkbox from '../Checkbox.svelte';
	import { onMount } from 'svelte';
	import Input from '../Input.svelte';
	import { convertQueryObjectToString } from '@ruzgardogu/utils';

	
	
	/**
	 * @typedef {import('./types').FilterConfig} FilterConfig
	 * @typedef {import('./types').Field} Field
	 * @typedef {import('./types').Option} Option
	 */

	/**
	 * @typedef {Object} Props
	 * @property {FilterConfig} filterConfig - The filter configuration object
	 * @property {Field} field - The field configuration object
	 * @property {Function} onChange - Function to call when the field value changes
	 */

	/** @type {Props} */
	let { field, onChange, filterConfig } = $props();

	// Create a local copy of the field to avoid direct mutation
	let _field = $derived(JSON.parse(JSON.stringify(field)));

	// Determine if this is a multiselect based solely on field type
	let isMultiSelect = $derived(_field.type === 'multiselect');

	// // Initialize state based on field.value and field type
	// /** @type {string|string[]|boolean|import('./types').RangeValue|null} */
	// let selectedValues = $state(
	// 	isMultiSelect
	// 		? (field.value && Array.isArray(field.value) ? field.value : []) 
	// 		: field.value
	// );

	// State for server-side filtering
	let searchTerm = $state('');
	let isLoading = $state(false);

    // State for server-side filtering

    /**
     * Local copy of options for server-side filtering
     * @type {Option[]}
     */
	 let localOptions = $state([]);

/**
 * Cache to store all items ever fetched
 * @type {Option[]}
 */
let optionsCache = $state([]);
	let pagination = $state({
		offset: 0,
		limit: 10,
		total: 0
	});

    /**
     * @typedef {string|string[]|boolean|import('./types').RangeValue|null|undefined} SelectedValuesType
     */

    // Initialize `selectedValues` outside of its own scope
    /** @type {SelectedValuesType} */
    let selectedValues;

    $effect(() => {
        selectedValues = isMultiSelect
            ? (field.value && Array.isArray(field.value) ? field.value : [])
            : field.value;
    });

	/**
	 * Function to handle selection change
	 * @param {string|boolean} value - The selected option value
	 */
	function handleSelection(value) {
		if (isMultiSelect) {
			// Multi-select mode
			/** @type {string[]} */
			const currentValues = /** @type {string[]} */ (selectedValues) || [];
			const index = currentValues.indexOf(/** @type {string} */ (value));

			if (index === -1) {
				// Add value if not already selected
				selectedValues = [...currentValues, /** @type {string} */ (value)];
			} else {
				// Remove value if already selected
				selectedValues = currentValues.filter(
					/** @param {string} option */ (option) => option !== value
				);
			}
		} else {
			// Single-select mode
			selectedValues = value;
		}

		// Update the field value in parent component
		_field.value = selectedValues;
		_field && onChange && onChange(_field);

		// Clear search term after selection but keep showing cached items
		if (_field.serverSide) {
			searchTerm = '';
			localOptions = [...optionsCache]; // Show cached results when search is cleared
		}
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
		if (isMultiSelect) {
			/** @type {string[]} */
			const values = /** @type {string[]} */ (selectedValues) || [];
			return values.includes(/** @type {string} */ (value));
		} else {
			// Handle special case for boolean values
			if (typeof selectedValues === 'boolean' || typeof value === 'boolean') {
				return selectedValues === value;
			}

			// String comparison for other values
			return String(selectedValues) === String(value);
		}
	}

	// Get appropriate component based on field type
	const SelectionComponent = $derived(isMultiSelect ? Checkbox : Radio);

    /**
     * @typedef {Object} SearchFilter
     * @property {string} column - The column to search in
     * @property {string} value - The search value
     */

    /**
     * @typedef {Object} Filter
     * @property {SearchFilter} [search] - The search filter object
     */

	/**
	 * Fetch options from the server
	 * @param {string} searchText - The search text to filter by
	 */
	async function fetchServerOptions(searchText) {
		if (!_field.serverSide || !_field.endpoint) return;
		
		isLoading = true;
		try {
			// Create filter object for search if searchText exists
			/** @type {Filter} */
			const filter = {};
			if (searchText) {
				filter.search = {
					column: _field.nameKey || 'adi',
					value: searchText
				};
			}
			
			// Use the utility function to generate the query string
			const queryParams = convertQueryObjectToString(pagination, filter);
			
			const response = await fetch(`${_field.endpoint}${queryParams}`, {
				method: 'GET',
				redirect: 'follow'
			});
			
			if (!response.ok) throw new Error('Failed to fetch options');
			
			const result = await response.json();
			
			if (result && result.data) {
				// Update local options with the current search results
				localOptions = result.data;
				
				// Add new items to cache if they don't already exist
				updateCache(result.data);
				
				// Update pagination if metadata is available
				if (result.metadata) {
					pagination.total = result.metadata.total || 0;
				}
			}
		} catch (error) {
			console.error('Error fetching options:', error);
		} finally {
			isLoading = false;
		}
	}

	/**
	 * Update the cache with new items
	 * @param {Array<any>} newItems - The new items to add to the cache
	 */
	function updateCache(newItems) {
		if (!Array.isArray(newItems) || newItems.length === 0) return;
		
		// Use a Set to track IDs we've already added to the cache
		const existingIds = new Set(optionsCache.map(item => item.id));
		
		// Filter out items that are already in the cache
		const itemsToAdd = newItems.filter(item => !existingIds.has(item.id));
		
		// Only update the cache if there are new items
		if (itemsToAdd.length > 0) {
			optionsCache = [...optionsCache, ...itemsToAdd];
		}
	}

	/**
	 * Helper function to ensure unique display options to avoid duplicate selections
	 * @param {Array<any>} options - The options array to deduplicate
	 * @returns {Array<any>} Deduplicated options array
	 */
	function getUniqueOptions(options) {
		if (!Array.isArray(options)) return [];
		
		// Use a Map to track unique items by ID
		const uniqueMap = new Map();
		options.forEach(item => {
			if (!uniqueMap.has(item.id)) {
				uniqueMap.set(item.id, item);
			}
		});
		
		return Array.from(uniqueMap.values());
	}

	// Declare searchTimeout with an explicit type
    /** @type {number | NodeJS.Timeout | undefined} */
	let searchTimeout;

	/**
	 * Handle search input change
	 * @param {Event} event - The input event
	 */
	function handleSearchInput(event) {
		// @ts-ignore
		searchTerm = event.target.value;
		
		// If search is cleared, show cached results
		if (!searchTerm) {
			// Ensure we're showing the cached results when search is cleared
			localOptions = [...optionsCache];
			return;
		}
		
		// Debounce search requests
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => {
			pagination.offset = 0; // Reset pagination on new search
			fetchServerOptions(searchTerm);
		}, 300);
	}


	
	onMount(() => {
		if (_field.serverSide) {
			// Initialize with empty search to load first page
			fetchServerOptions('');

			// If we have a selected value, try to fetch its details
			if (selectedValues && _field.endpoint) {
				// This would be enhanced to fetch details for pre-selected items
				// For now, we'll just initialize with the first page
			}
		}
	});

	// Computed property to determine which options to display
	$effect(() => {
		if (_field.serverSide) {
			// Server-side options are managed via localOptions
			// Initial display shows cached options when not searching
			if (!searchTerm && optionsCache.length > 0) {
				localOptions = optionsCache;
			}
		} else {
			// Client-side filtering remains unchanged
			localOptions = _field.options || [];
		}
	});

</script>

<div
	class="advanced-filter--selection {isMultiSelect
		? 'advanced-filter--multiselect'
		: 'advanced-filter--single-select'}"
>
	{#if _field.serverSide}
		<div class="advanced-filter--search">
			<Input 
				placeholder={_field.placeholder || "Search..."} 
				value={searchTerm}
				oninput={handleSearchInput}
			/>
			{#if isLoading}
				<div class="advanced-filter--loading">{filterConfig?.translation?.general?.loading|| 'Loading...'}</div>
			{/if}
		</div>
	{/if}

	<div class="advanced-filter--filter-options">
		{#if _field.serverSide}
			{#if localOptions && localOptions.length > 0}
				{#each getUniqueOptions(localOptions) as option (option.id)}
					<div class="advanced-filter--item">
						<SelectionComponent
							name={_field.name}
							value={option.id}
							label={option[_field.nameKey || 'adi']}
							checked={isSelected(option.id)}
							onchange={() => handleSelection(option.id)}
						/>
					</div>
				{/each}
			{:else}
				<div class="advanced-filter--no-results">
					{isLoading ? (filterConfig?.translation?.general?.loadingOptions || 'Loading options...') : (filterConfig?.translation?.general?.noOptions || 'No options found')}
				</div>
			{/if}
		{:else if isSimpleOptions(_field.options)}
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

		{#if _field.serverSide && pagination.total > (searchTerm ? localOptions.length : optionsCache.length)}
			<div class="advanced-filter--load-more">
				<button 
					class="btn btn-sm btn-light" 
					onclick={() => {
						pagination.offset += pagination.limit;
						fetchServerOptions(searchTerm);
					}}
					disabled={isLoading}
				>
					Load more
				</button>
			</div>
		{/if}
	</div>
</div>
