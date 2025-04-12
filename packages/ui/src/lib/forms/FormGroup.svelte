<script>
	/**
	 * @typedef {Object<string, any>} Props
	 * @property {any} children
	 * @property {boolean} noBorder
	 */

	/** @type {Props} */
	let { children, noBorder=false, ...rest } = $props();
</script>

<table class="form-group" class:form-group--no-border={noBorder} {...rest}>
	<tbody>
		{@render children?.()}
	</tbody>
</table>
