<script>
	/**
	 * @typedef {Object<string, any>} Props
	 * @property {string} [class]
	 * @property {boolean} [disabled]
	 * @property {any} [rest]
	 * @property {boolean} [dropdown]
	 * @property {any} [value]
	 * @property {'small' | 'medium' | 'large'} size
	 * @property {HTMLInputElement} element
	 */

	/** @type {Props} */
	let {
		class: cls = '',
		value = $bindable(),
		disabled = false,
		size = 'medium',
		dropdown = false,
		element,
		...rest
	} = $props();

</script>

<input
	bind:value
	bind:this={element}
	class="form-input {size == 'medium' ? '' : `form-input--${size}`} {cls}"
	class:button--dropdown={dropdown}
	{...rest}
	{disabled}
	class:form-input--disabled={disabled}
/>
