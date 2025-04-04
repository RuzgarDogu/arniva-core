<script>
	import SelectDropdown from './SelectDropdown.svelte';

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
	 * @property {boolean} search
	 * @property {string} placeholder
	 * @property {() => void} onSelect - Callback function when an option is selected
	 * @property {string} value - Selected value
	 * @property {SelectOption[]} data - Array of options for the dropdown/select
	 * @property {any} children
	 */

	/** @type {Props} */
	let {
		children,
		value = $bindable(),
		class: cls = '',
		placeholder = '',
		size = 'medium',
		disabled = false,
		search = false,
		data = [],
		onSelect,
		...rest
	} = $props();
</script>

{#if search}
	<SelectDropdown bind:value {data} {onSelect} {placeholder} />
{:else}
	<select
		class="form-select {size == 'medium' ? '' : `form-select--${size}`} {cls}"
		{...rest}
		{disabled}
		bind:value
	>
		{#if placeholder}
			<option class="form-select--placeholder" disabled selected>{placeholder}</option>
		{/if}
		{@render children?.()}
	</select>
{/if}
