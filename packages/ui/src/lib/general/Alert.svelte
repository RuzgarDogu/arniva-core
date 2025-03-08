<script>
	/**
	 * @typedef {Object<string, any>} Props
	 * @property {string} title
	 * @property {'primary' | 'secondary' | 'default' | 'accent' | 'success' | 'danger' | 'warning'} color
	 * @property {any} children
	 * @property {any} rest
	 */

	/** @type {Props} */
	let { children, title = '', color = 'default', ...rest } = $props();
</script>

<div class="alert alert--{color}" {...rest}>
	{#if title}
		<div class="alert--title">{title}</div>
	{/if}
	{@render children?.()}
</div>
