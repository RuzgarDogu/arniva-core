<script>
	/**
	 * @typedef {Object<string, any>} Props
	 * @property {import('svelte').Snippet} children The aside content
	 * @property {string} [class] The class to add to the aside
	 * @property {string} [mode] The mode of the layout
	 */

	/** @type {Props} */
	let { children, class: cls = '', ...rest } = $props();
</script>

<aside class="layout__sidebar {cls}" {...rest}>
	<!-- Sidebar content -->
	{@render children()}
</aside>
