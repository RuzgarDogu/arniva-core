<script>
	/**
	 * @typedef {Object<string, any>} Props
	 * @property {string} class
	 * @property {boolean} disabled
	 * @property {'small' | 'medium' | 'large'} size
	 * @property {any} rest
	 * @property {any} children
	 */

	/** @type {Props} */
	let { children, class: cls = '', size = 'medium', disabled = false, ...rest } = $props();
</script>

<select
	class="form-select {size == 'medium' ? '' : `form-select--${size}`} {cls}"
	{...rest}
	{disabled}
>
	{@render children?.()}
</select>
