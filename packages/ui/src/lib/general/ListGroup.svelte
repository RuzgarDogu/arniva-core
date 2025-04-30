<script>
	/**
	 * @typedef {Object<string, any>} Props
	 * @property {number} [columns] Number of columns (1-5)
	 * @property {any} [children] ListGroupItem content
	 * @property {any} rest ListGroupItem props
	 */

	/** @type {Props} */
	let { columns = 1, children, ...rest } = $props();

	// Ensure columns is within the range of 1 to 5
	const columnsClass = `list-group--columns-${Math.min(Math.max(columns, 1), 5)}`;
</script>

<div class={`list-group ${columnsClass}`} {...rest}>
	{@render children?.()}
</div>
