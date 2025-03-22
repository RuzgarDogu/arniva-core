<script>
	import Dropdown from '../../general/Dropdown.svelte';
	import Button from '../../general/Button.svelte';
	import DropdownContent from '../../general/DropdownContent.svelte';
	import Input from '../Input.svelte';
	import InputGroup from '../InputGroup.svelte';
	import Icon from '../../icons/Icon.svelte';
	import AdvancedFilterContent from './AdvancedFilterContent.svelte';
	import Checkbox from '../Checkbox.svelte';

	/**
	 * @typedef {import('./types').FilterConfig} FilterConfig
	 * @typedef {import('./types').Field} Field
	 */

	/**
	 * @typedef {Object} Props
	 * @property {FilterConfig} filterConfig - The filter configuration object
	 * @property {Function} onChange - Callback function triggered when filter values change
	 * @property {string} class - Additional classes to apply to the component
	 * @property {string} buttonText - The text to display on the main filter button
	 */

	/** @type {Props} */
	let { filterConfig, onChange, class:cls='' } = $props();

	let searchText = $state('');
	// Keep track of the current highest order
	let currentOrder = $state(0);

	let fields = $state(
		filterConfig.fields.map((field) => {
			return {
				...field,
				value: '',
				isOpen: false,
				order: -1 // Initialize with -1 (means never opened)
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
	 * @param {Field} field - The field to toggle
	 */
	function toggleFieldDropdown(field) {
		// Toggle the isOpen state
		let _field = fields.find((f) => f.name === field.name);
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
			// Get the dropdown reference (after the state has been updated)
			let dd = fieldDropdown[field.name];

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
	 * @param {{name: string, value: any, isOpen: boolean}} e - The change object with field name and new value
	 */
	function handleChange(e) {
		/** @type {Field|undefined} */
		let _field = fields.find((f) => f.name === e.name);
		if (!_field) return;

		_field.value = e.value;
		_field.isOpen = e.isOpen;
		filter[e.name] = e.value;
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

	/**
	 * Function to handle search input
	 * @param {InputEvent} e - The input event
	 */
	function handleSearch(e) {
		// Cast the target to HTMLInputElement
		let search = e?.target && /** @type {HTMLInputElement} */ (e.target).value;
		if (!search || search === '') {
			delete filter.search;
			onChange && filter && onChange(filter);
			return;
		}
		filter.search = search;
		onChange && filter && onChange(filter);
		return;
	}

	/**
	 * Function to check if filters exist
	 * @returns {boolean} True if filters exist, false otherwise
	 */
	function checkIfFiltersExist() {
		return Object.keys(filter).length > 0;
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
		searchText = '';
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
</script>

<InputGroup class={['advanced-filter', cls].join(' ')}>
	<Dropdown bind:this={filterDropdown}>
		<Button dropdown size="small" square color="primary" class="advanced-filter--main-button">
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

	{#each orderedOpenFields as field (field.name)}
		<div
			class="advanced-filter--dropdown-wrapper"
			class:advanced-filter--dropdown-wrapper--no-value={field.value === '' ||
				field.value === null ||
				field.value === undefined}
		>
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
							{:else if field.type === 'date'}
								{@const dateText = getDateText(field)}
								{#if dateText}
									<span class="advanced-filter--item-label">({dateText})</span>
								{/if}
							{:else}
								{@const val = field.options?.find((o) => o.value === field.value)}
								{#if val && val.label}
									<span class="advanced-filter--item-label">({val.label})</span>
								{:else if field.value}
									<span class="advanced-filter--item-label">({field.value})</span>
								{/if}
							{/if}
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
					<AdvancedFilterContent {filterConfig} {field} onChange={handleChange} />
				</DropdownContent>
			</Dropdown>
		</div>
	{/each}
	<Input oninput={handleSearch} bind:value={searchText} />
	{#if checkIfFiltersExist()}
		<Button class="advanced-filter--reset" size="small" color="success" onClick={resetFilter}>
			Reset
			<Icon icon="ic:baseline-close" width="14" height="14" />
		</Button>
	{/if}
</InputGroup>
