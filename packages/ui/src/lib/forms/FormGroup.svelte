<script>
	/**
	 * @typedef {Object<string, any>} Props
	 * @property {any} children
	 */

	/** @type {Props} */
	let { children, ...rest } = $props();
</script>

<table class="form-group" {...rest}>
	<tbody>
		{@render children?.()}
	</tbody>
</table>
