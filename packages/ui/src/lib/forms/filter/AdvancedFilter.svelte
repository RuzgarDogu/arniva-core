<script>
	import Dropdown from '../../general/Dropdown.svelte';
	import Button from '../../general/Button.svelte';
	import DropdownContent from '../../general/DropdownContent.svelte';
	import InputGroup from '../InputGroup.svelte';
	import Icon from '../../icons/Icon.svelte';
	import AdvancedFilterContent from './AdvancedFilterContent.svelte';
	import Checkbox from '../Checkbox.svelte';
	import AdvancedFilterInput from './AdvancedFilterInput.svelte';

	/**
	 * @typedef {import('./types').FilterConfig} FilterConfig
	 * @typedef {import('./types').Field} Field
	 */

	/**
	 * @typedef {Object} Props
	 * @property {FilterConfig} filterConfig - The filter configuration object
	 * @property {Function} onChange - Callback function triggered when filter values change
	 * @property {"primary"|"secondary"|"success"|"danger"|"warning"|"light"} [filterButtonColor] - Color of the filter button
	 * @property {string} [class] - Additional classes to apply to the component
	 */

	/** @type {Props} */
	let { filterConfig, onChange, class: cls = '', filterButtonColor = 'light' } = $props();

	// Keep track of the current highest order
	let currentOrder = $state(0);
	let resetTrigger = $state(0);

	let fields = $state(
		filterConfig.fields.map((field) => {
			return {
				...field,
				value: '',
				isOpen: false,
				order: -1,
				// Generate a unique identifier for each field entry based on name and type
				_id: `${field.name}_${field.type}`
			};
		})
	);

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
	 * @param {Field & {_id?: string}} field - The field to toggle
	 */
	function toggleFieldDropdown(field) {
		// Make sure _id exists before using it as an index
		if (!field._id) {
			console.error('Field is missing _id property:', field);
			return;
		}

		// Toggle the isOpen state - use _id to uniquely identify fields with the same name
		let _field = fields.find((f) => f._id === field._id);
		if (!_field) return;
		_field.isOpen = !_field.isOpen;

		// If opening, always assign the highest order
		if (_field.isOpen) {
			currentOrder++;
			_field.order = currentOrder;
			// If we have a value already saved for this field, restore it to the filter
			if (_field.value) {
				filter[_field.name] = _field.value;
			}
		} else {
			// If closing, remove from filter
			delete filter[_field.name];
			// Don't clear the field value so it can be restored if reopened
		}

		// Notify about the filter change
		onChange && onChange(filter);

		// Ensure next tick to allow rendering
		setTimeout(() => {
			// Get the dropdown reference using _id instead of name
			if (!field._id) return;
			let dd = fieldDropdown[field._id];

			if (dd && _field.isOpen) {
				dd.show();
				filterDropdown && filterDropdown.hide();
			} else if (dd && !_field.isOpen) {
				dd.hide();
			} else {
				console.log('Dropdown reference not found');
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
	 * @param {{name: string, value: any, isOpen: boolean, type: string}} e - The change object with field details
	 */
	function handleChange(e) {
		// Find field by both name and type to handle same-name fields correctly
		/** @type {Field|undefined} */
		let _field = fields.find((f) => f.name === e.name && f.type === e.type);
		if (!_field) return;

		_field.value = e.value;
		_field.isOpen = e.isOpen;

		// Store in filter object, distinguishing by type if needed
		if (_field.type === 'multiselect') {
			// For multiselect, ensure we don't overwrite single select values
			if (!filter[e.name] || !Array.isArray(filter[e.name])) {
				filter[e.name] = e.value;
			} else {
				filter[e.name] = e.value;
			}
		} else {
			filter[e.name] = e.value;
		}

		onChange && fields && onChange(filter);
	}

	let orderedOpenFields = $derived.by(() => {
		// Sort by order (most recently opened last)
		return fields.filter((f) => f.isOpen).sort((a, b) => a.order - b.order);
	});

	/**
	 * Function to delete a field from the filter
	 * @param {Field} field - The field to delete
	 */
	function deleteField(field) {
		field.isOpen = false;
		field.value = '';
		field.order = -1;
		// Delete the property instead of setting it to empty string
		delete filter[field.name];
		onChange && fields && onChange(filter);
	}

	/**
	 * Process a value and extract range information
	 * @param {any} value - The value to extract range information from, could be a RangeValue object or another type
	 * @returns {import('./types').RangeValue|any} - The processed range value or the original value if not applicable
	 */
	function getRangeValue(value) {
		if (value && typeof value === 'object' && !Array.isArray(value)) {
			return {
				start: value.min ?? value.start,
				end: value.max ?? value.end
			};
		}
		return value;
	}

	/**
	 * Function to check if filters exist
	 * @returns {boolean} True if filters exist, false otherwise
	 */
	function checkIfFiltersExist() {
		// Check if there are any non-empty values in the filter object
		return (
			Object.keys(filter).length > 0 &&
			Object.values(filter).some((value) => {
				// Check if it's truly a value that would trigger filtering
				if (value === null || value === undefined || value === '') return false;
				// Check for empty arrays
				if (Array.isArray(value) && value.length === 0) return false;
				// Check for empty objects (for range filters or dates with no selection)
				if (
					typeof value === 'object' &&
					value !== null &&
					Object.values(value).every((v) => v === null || v === undefined || v === '')
				)
					return false;
				return true;
			})
		);
	}

	/**
	 * Function to delete all filters
	 */
	function resetFilter() {
		filter = {};
		fields = fields.map((f) => {
			f.isOpen = false;
			f.value = '';
			f.order = -1;
			return f;
		});
		resetTrigger++;

		onChange && filter && onChange(filter);
	}

	/**
	 * Formats date values for display in filter UI
	 * @param {import('./types').Field} field - The field containing date value(s)
	 * @returns {string} Formatted date string in European format (DD/MM/YYYY)
	 */
	function getDateText(field) {
		// Helper function to format date in European format (DD/MM/YYYY)
		/**
		 * @param {string|number} dateStr - The date string to format
		 * @returns {string} Formatted date in DD/MM/YYYY format
		 */
		function formatToEuropeanDate(dateStr) {
			if (!dateStr) return '';
			const date = new Date(dateStr);
			const day = date.getDate().toString().padStart(2, '0');
			const month = (date.getMonth() + 1).toString().padStart(2, '0');
			const year = date.getFullYear();
			return `${day}/${month}/${year}`;
		}

		const rangeValue = /** @type {import('./types').RangeValue} */ (field.value);
		if (field.dateRange && field.value) {
			let start = rangeValue.start;
			let end = rangeValue.end;
			if (!start && !end) return '';

			// Format dates using European format
			let startDate = start ? formatToEuropeanDate(start) : '';
			let endDate = end ? formatToEuropeanDate(end) : '';

			// Handle cases where only one date is provided in range mode
			if (startDate && endDate) {
				return `${startDate} - ${endDate}`;
			} else if (startDate) {
				return startDate;
			} else if (endDate) {
				return endDate;
			}
		} else if (field.value && rangeValue.start) {
			let start = rangeValue.start;
			if (!start) return '';

			// Format single date using European format
			return formatToEuropeanDate(start);
		}
		return '';
	}

	/**
	 * Gets the display text for a field's value
	 * @param {Field} field - The field to get display text for
	 * @returns {string} The formatted display text
	 */
	function getFieldDisplayText(field) {
		if (field.type === 'range' && field.value && typeof field.value === 'object') {
			const rangeValue = getRangeValue(field.value);
			return `(${rangeValue.start} - ${rangeValue.end})`;
		} else if (field.type === 'date') {
			const dateText = getDateText(field);

			return dateText ? `(${dateText})` : '';
		} else if (
			field.type === 'multiselect' &&
			Array.isArray(field.value) &&
			field.value.length > 0
		) {
			// Just show the count for multiselect fields
			let selectedText = filterConfig?.translation?.general?.selected || 'selected';
			return `(${field.value.length} ${selectedText})`;
		} else if (field.value !== null && field.value !== undefined && field.value !== '') {
			// For single select or other values, just show the value itself
			return `(${field.value})`;
		}
		return '';
	}

	/**
	 * @typedef {Object} ColumnSearch
	 * @property {string} column - The column to search in
	 * @property {string} value - The search term/value
	 */

	/**
	 * Handles input from the AdvancedFilterInput component
	 * @param {ColumnSearch|null} e - Object containing column and value, or null when cleared
	 */
	function handleInput(e) {
		if (!e || e.value === '') {
			delete filter.search;
			onChange && filter && onChange(filter);
			return;
		}
		filter.search = e;
		onChange && filter && onChange(filter);
		return;
	}

	/**
	 * Normalizes search columns into the expected Column format
	 * @param {Array<{value: string, label: string}|string>} columns - Raw column data from config
	 * @returns {Array<{value: string, label: string}>} - Normalized column objects
	 */
	function normalizeColumns(columns) {
		return columns.map((column) => {
			if (typeof column === 'string') {
				return { value: column, label: column };
			}
			return column;
		});
	}
</script>

<InputGroup class={['advanced-filter', cls].join(' ')}>
	<Dropdown bind:this={filterDropdown}>
		<Button
			dropdown
			size="small"
			square
			color={filterButtonColor}
			class="advanced-filter--main-button"
		>
			<Icon icon="mdi:filter-outline" width="14" height="14" />
			{filterConfig?.translation?.general?.filter || 'Filter'}
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

	{#each orderedOpenFields as field (field._id)}
		<div
			class="advanced-filter--dropdown-wrapper"
			class:advanced-filter--dropdown-wrapper--no-value={field.value === '' ||
				field.value === null ||
				field.value === undefined}
		>
			<Dropdown bind:this={fieldDropdown[field._id]}>
				<div class="advanced-filter--dropdown">
					<Button dropdown size="small" square color="transparent">
						{field.label}
						{#if field.value !== null && field.value !== undefined && field.value !== ''}
							<span class="advanced-filter--item-label">
								{getFieldDisplayText(field)}
							</span>
						{/if}
					</Button>
					<Button
						class="advanced-filter--close"
						size="small"
						square
						color="transparent"
						onClick={() => deleteField(field)}
					>
						<Icon icon="ic:baseline-close" width="14" height="14" />
					</Button>
				</div>
				<DropdownContent>
					<AdvancedFilterContent
						{filterConfig}
						field={{ ...field, _id: field._id }}
						onChange={handleChange}
					/>
				</DropdownContent>
			</Dropdown>
		</div>
	{/each}

	<!-- <AdvancedFilterInput {resetTrigger} columns={filterConfig?.search?.columns || []} onSelect={handleInput}/> -->

	<AdvancedFilterInput
		{resetTrigger}
		columns={normalizeColumns(filterConfig?.search?.columns || [])}
		onSelect={handleInput}
	/>

	{#if checkIfFiltersExist()}
		<Button class="advanced-filter--reset" size="small" color="success" onClick={resetFilter}>
			Reset
			<Icon icon="ic:baseline-close" width="14" height="14" />
		</Button>
	{/if}
</InputGroup>
