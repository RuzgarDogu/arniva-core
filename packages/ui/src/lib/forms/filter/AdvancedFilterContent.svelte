<script>
	import AdvancedFilterRange from './AdvancedFilterRange.svelte';
	import AdvancedFilterSelection from './AdvancedFilterSelection.svelte';
	import AdvancedFilterDate from './AdvancedFilterDate.svelte';
	import Icon from '../../icons/Icon.svelte';
	/**
	 * @typedef {import('./types').Field} Field
	 * @typedef {import('./types').FilterConfig} FilterConfig
	 */

	/**
	 * @typedef {Object} RangeComponentInstance
	 * @property {() => void} reset - Method to reset the range
	 */

	/**
	 * @typedef {Object} DateComponentInstance
	 * @property {() => void} reset - Method to reset the date
	 */

	/**
	 * @typedef {Object} Props
	 * @property {Field} field - The field configuration object
	 * @property {Function} onChange - Function to call when the field value changes
	 * @property {FilterConfig} filterConfig - The filter configuration object
	 */

	/** @type {Props} */
	let { field, onChange, filterConfig } = $props();
	let _field = $state(JSON.parse(JSON.stringify(field)));

	/**
	 * Reference to the AdvancedFilterRange component instance
	 * @type {RangeComponentInstance | null}
	 */
	let filterRangeContainer = $state(null);

	/**
	 * Reference to the AdvancedFilterDate component instance
	 * @type {DateComponentInstance | null}
	 */
	let filterDateContainer = $state(null);

	function clearSelections() {
		_field.value = null;
		_field && onChange && onChange({ 
			name: field.name, 
			type: field.type, // Pass the type to identify the field
			value: null, 
			isOpen: true 
		});

		// Reset range component if it exists
		filterRangeContainer?.reset();
		filterDateContainer?.reset();
	}

	function deleteField() {
		_field.value = [];
		_field.isOpen = false;
		_field && onChange && onChange({ 
			name: field.name, 
			type: field.type, // Pass the type to identify the field
			value: [], 
			isOpen: false 
		});
		filterRangeContainer?.reset();
		filterDateContainer?.reset();
	}

	/**
	 * Extracts range values from a field, handling type checks
	 * @param {import('./types').Field} field - The field to extract range values from
	 * @returns {import('./types').RangeValue|null} The range value object or null
	 */
	function getRangeValue(field) {
		if (field.type === 'range' && field.value && typeof field.value === 'object') {
			// Only attempt to cast to RangeValue if field type is 'range'
			const value = /** @type {import('./types').RangeValue} */ (field.value);
			return {
				start: value.min ?? value.start,
				end: value.max ?? value.end
			};
		}
		return null;
	}
</script>

{#if !field}
	<div>No fields to display</div>
{:else}
	<div class="advanced-filter--content">
		<div class="advanced-filter--content-header">
			{_field.text}
			{#if _field.type === 'range' && _field.value && typeof _field.value === 'object'}
				{@const rangeValue = getRangeValue(_field)}
				{#if rangeValue && (typeof rangeValue.start !== 'undefined' || typeof rangeValue.end !== 'undefined')}
					<span class="advanced-filter--content-header-right">
						({rangeValue.start} - {rangeValue.end})
					</span>
				{/if}
			{/if}
		</div>
		<div class="advanced-filter--content-body">
			{#if _field.type === 'range'}
				<AdvancedFilterRange field={_field} {onChange} bind:this={filterRangeContainer} />
			{:else if _field.type === 'multiselect'}
				<AdvancedFilterSelection {filterConfig} field={_field} {onChange} />
			{:else if field.type === 'select' || field.type === 'boolean'}
				<AdvancedFilterSelection {filterConfig} field={_field} {onChange} />
			{:else if field.type === 'date'}
				<AdvancedFilterDate translation={filterConfig?.translation?.date} field={_field} {onChange} bind:this={filterDateContainer} />
			{/if}
		</div>
		<div class="advanced-filter--content-footer">
			<button class="btn-clear" onclick={clearSelections}>
				{filterConfig?.translation?.general?.clear || 'Clear Selection'}
				<Icon name="xmark" size="17px" />
			</button>
			<button class="btn-clear" onclick={deleteField}>
				{filterConfig?.translation?.general?.delete || 'Delete'}
				<Icon name="trash-bin-2" size="17px" />
			</button>
		</div>
	</div>
{/if}
