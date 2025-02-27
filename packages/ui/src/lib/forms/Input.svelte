<script>
	/**
	 * @typedef {Object<string, any>} Props
	 * @property {string} [class]
	 * @property {boolean} [disabled]
	 * @property {any} [rest]
	 * @property {boolean} [dropdown]
	 * @property {'small' | 'medium' | 'large'} size
	 */

	/** @type {Props} */
	let { class: cls = '', disabled = false, size = 'medium', dropdown=false, ...rest } = $props();
</script>

<input
	class="form-input {size == 'medium' ? '' : `form-input--${size}`} {cls}"
	class:button--dropdown={dropdown}
	{...rest}
	{disabled}
	class:form-input--disabled={disabled}
/>
