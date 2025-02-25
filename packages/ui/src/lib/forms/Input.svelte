<script>
	/**
	 * @typedef {Object<string, any>} Props
	 * @property {string} [class]
	 * @property {boolean} [disabled]
	 * @property {'small' | 'medium' | 'large'} size
	 */

	/** @type {Props} */
	let { class: cls = '', disabled = false, size = 'medium', ...rest } = $props();
</script>

<input
	class="form-input {size == 'medium' ? '' : `form-input--${size}`} {cls}"
	{...rest}
	{disabled}
	class:form-input--disabled={disabled}
/>
