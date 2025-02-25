<script>
	/**
	 * @typedef {Object<string, any>} Props
	 * @property {import('svelte').Snippet} children The main content
	 * @property {string} [class] The class to add to the content
	 */

	/** @type {Props} */
	let { children, class: cls = '', ...rest } = $props();
</script>

<div class="layout__content {cls}" {...rest}>
	<!-- Content content -->
	{@render children()}
</div>
