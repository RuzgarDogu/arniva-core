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
	 * @param {{ start: Date|null; end: Date|null; }} e - Date event containing start and end dates
	 */
	function handleChange(e) {
		// Create a deep copy of the field to avoid modifying the original
		let _field = JSON.parse(JSON.stringify(field));
		
		// For date ranges
		if (field.dateRange) {
			if (e && e.start && e.end) {
				// Set both start and end dates for range
				_field.value = {
					start: e.start.toISOString(),
					end: e.end.toISOString()
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
				start: e.start.toISOString(),
				end: e.end ? e.end.toISOString() : null
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
