<script>
	/**
	 * @typedef {Object<string, any>} Props
	 * @property {import('svelte').Snippet} children The navigation content
	 * @property {string} [class] The class to add to the navigation
	 */

	/** @type {Props} */
	let { children, class: cls = '', ...rest } = $props();
</script>

<div class="layout__nav {cls}" {...rest}>
	<!-- Navigation content -->
	{@render children()}
</div>
