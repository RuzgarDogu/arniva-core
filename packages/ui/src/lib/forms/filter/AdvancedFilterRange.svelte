<script>
	import Range from '../Range.svelte';
	import { onMount } from 'svelte';

	/**
	 * @typedef {import('./types').Field} Field
	 * @typedef {import('./types').RangeValue} RangeValue
	 */

	/**
	 * @typedef {Object} RangeComponent
	 * @property {() => void} reset - Method to reset the range
	 * @property {(type: string, callback: (e: any) => void) => () => void} [$$on] - Svelte component event handler
	 * @property {(props: any) => void} [$$set] - Svelte component property setter
	 */

	/**
	 * @typedef {Object} Props
	 * @property {Field} field - The name of the filter
	 * @property {Function} onChange - Callback function triggered when filter values change
	 */

	/** @type {Props} */
	let { field, onChange } = $props();

	let _field = $state(JSON.parse(JSON.stringify(field)));

	/**
	 * Reference to the Range component instance
	 * @type {RangeComponent | null}
	 */
	let rangeContainer = $state(null);

	export function reset() {
		rangeContainer?.reset();
	}

	let _rangeValues = {
		min: _field?.range?.min || 0,
		max: _field?.range?.max || 100
	};

	/** @type {HTMLDivElement} */
	let container;
	let isInitialized = $state(false);

	onMount(() => {
		// Delay initialization slightly to ensure dropdown positioning is complete
		setTimeout(() => {
			isInitialized = true;
		}, 50);

		// Create a mutation observer to detect when the dropdown becomes visible
		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (
					mutation.type === 'attributes' &&
					(mutation.attributeName === 'style' || mutation.attributeName === 'class')
				) {
					// Check if we're now visible
					const isVisible =
						container &&
						window.getComputedStyle(container).display !== 'none' &&
						window.getComputedStyle(container).visibility !== 'hidden';

					if (isVisible && !isInitialized) {
						isInitialized = true;
					}
				}
			}
		});

		// Look for the closest dropdown-content parent
		const dropdownContent = container?.closest('.dropdown-content');
		if (dropdownContent) {
			observer.observe(dropdownContent, { attributes: true });
		}

		return () => observer.disconnect();
	});

	/**
	 * Handle range change from the Range component
	 * @param {number | { start: number, end: number }} value
	 */
	function handleRangeChange(value) {
		if (!value || !onChange) return;

		// Convert incoming value to the format expected by the field
		let rangeValue;

		if (typeof value === 'number') {
			// For single range types (though this won't happen in this case)
			rangeValue = {
				min: value,
				max: value
			};
		} else {
			// For range types with start/end properties
			rangeValue = {
				min: value.start,
				max: value.end
			};
		}

		let _field = {
			...JSON.parse(JSON.stringify(field)),
			value: rangeValue
		};

		onChange(_field);
	}
</script>

<div class="advanced-filter--range" bind:this={container}>
	{#if isInitialized}
		<Range
			bind:this={rangeContainer}
			type="range"
			color="primary"
			min={_rangeValues?.min}
			max={_rangeValues?.max}
			onChange={handleRangeChange}
		/>
	{/if}
</div>
