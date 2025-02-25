<script>
	/**
	 * @typedef {Object<string, any>} Props
	 * @property {string} title
	 * @property {any} children
	 * @property {any} rest
	 */

	/** @type {Props} */
	let { children, title = '', ...rest } = $props();
</script>

<div class="tab-item" {...rest}>
	<div class="tab-item-header">
		{title}
	</div>
	<div class="tab-item-content">
		{@render children()}
	</div>
</div>
