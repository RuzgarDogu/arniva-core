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
	 * @property {boolean} [hasError] - Whether the input has validation errors
	 * @property {string} [errorMessage] - Error message to display
	 */

	/** @type {Props} */
	let {
		class: cls = '',
		value = $bindable(),
		disabled = false,
		size = 'medium',
		dropdown = false,
		element = $bindable(),
		hasError = false,
		errorMessage = '',
		...rest
	} = $props();

</script>

<input
	bind:value
	bind:this={element}
	class="form-input {size == 'medium' ? '' : `form-input--${size}`} {cls}"
	class:button--dropdown={dropdown}
	class:form-input--error={hasError}
	{...rest}
	{disabled}
	class:form-input--disabled={disabled}
/>

{#if hasError && errorMessage}
	<div class="form-input-error">{errorMessage}</div>
{/if}
