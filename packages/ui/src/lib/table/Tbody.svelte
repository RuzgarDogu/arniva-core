<script>
	/**
	 * @typedef {Object<string, any>} Props
	 * @property {any} [children] The table contents
	 * @property {string} [class] The table class
	 */

	/** @type {Props} */
	let { children, class: cls = '', element=$bindable() } = $props();
</script>

<tbody bind:this={element} class={['table--body', `${cls}`].join(' ')}>
	{@render children?.()}
</tbody>
