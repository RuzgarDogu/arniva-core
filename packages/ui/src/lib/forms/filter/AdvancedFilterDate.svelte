<script>
	import DatePicker from '../DatePicker.svelte';

	/**
	 * @typedef {import('./types').Field} Field
	 * @typedef {import('./types').DateTranslation} DateTranslation
	 */

	/**
	 * @typedef {Object} Props
	 * @property {Field} field - The name of the filter
	 * @property {Function} onChange - Callback function triggered when filter values change
	 * @property {DateTranslation} [translation] - Translation object for date picker
	 */

	/** @type {Props} */
	let { field, onChange, translation } = $props();

	/**
	 * @typedef {Object} DateEvent
	 * @property {Date|null} start - The start date
	 * @property {Date|null} end - The end date, null when not a range
	 */

	/**
	 * Handles changes from the DatePicker component
	 * @param {{ start: Date|string|number|null; end: Date|string|number|null; }} e - Date event containing start and end dates
	 */
	function handleChange(e) {
		// Create a deep copy of the field to avoid modifying the original
		let _field = JSON.parse(JSON.stringify(field));
		
		// For date ranges
		if (field.dateRange) {
			if (e && e.start && e.end) {
				// Set both start and end dates for range
				_field.value = {
					start: convertToISOString(e.start),
					end: convertToISOString(e.end)
				};
				
				// Always pass the type property to ensure proper handling in parent component
				onChange && onChange({
					name: _field.name,
					type: _field.type, // Explicitly include the type
					value: _field.value,
					isOpen: true
				});
			}
		} 
		// For single date selection
		else if (e && e.start) {
			_field.value = {
				start: convertToISOString(e.start),
				end: e.end ? convertToISOString(e.end) : null
			};
			
			// Always pass the type property to ensure proper handling in parent component
			onChange && onChange({
				name: _field.name,
				type: _field.type, // Explicitly include the type
				value: _field.value,
				isOpen: true
			});
		}
	}

	/**
	 * Helper function to convert various date formats to ISO string
	 * @param {Date|string|number} value - The date value to convert
	 * @returns {string} - ISO string representation of the date
	 */
	function convertToISOString(value) {
		if (typeof value === 'string') {
			return value;
		} else if (typeof value === 'number') {
			return new Date(value).toISOString();
		} else if (value instanceof Date) {
			return value.toISOString();
		}
		return '';
	}

	/**
	 * @typedef {Object} DatePickerInstance
	 * @property {() => void} reset - Resets the date picker
	 */

	/** @type {DatePickerInstance|null} */
	let datepicker = $state(null);
	export function reset() {
		datepicker && datepicker.reset();
	}
</script>

<div class="advanced-filter--date-picker">
	<DatePicker
		translation={translation}
		isEuropean={!field?.isAmerican}
		isRange={field.dateRange}
		quickSelect
		manualInput
		onChange={handleChange}
		bind:this={datepicker}
	/>
</div>
