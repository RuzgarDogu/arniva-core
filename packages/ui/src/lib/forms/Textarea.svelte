<script>
	/**
	 * @typedef {Object<string, any>} Props
	 * @property {string} [class]
	 * @property {boolean} [disabled]
	 * @property {any} [rest]
	 * @property {any} [value]
	 * @property {'small' | 'medium' | 'large'} size
	 * @property {HTMLTextAreaElement} element
	 * @property {boolean} [hasError] - Whether the textarea has validation errors
	 * @property {string} [errorMessage] - Error message to display
	 * @property {number} [rows] - Number of rows for the textarea
	 * @property {number} [cols] - Number of columns for the textarea
	 * @property {boolean} [resize] - Whether the textarea can be resized
	 */

	/** @type {Props} */
	let {
		class: cls = '',
		value = $bindable(),
		disabled = false,
		size = 'medium',
		element = $bindable(),
		hasError = false,
		errorMessage = '',
		rows = 4,
		cols,
		resize = true,
		...rest
	} = $props();
</script>

<textarea
	bind:value
	bind:this={element}
	class="form-textarea {size == 'medium' ? '' : `form-textarea--${size}`} {cls}"
	class:form-textarea--error={hasError}
	class:form-textarea--disabled={disabled}
	class:form-textarea--no-resize={!resize}
	{rows}
	{cols}
	{disabled}
	{...rest}
></textarea>

{#if hasError && errorMessage}
	<div class="form-input-error">{errorMessage}</div>
{/if}
