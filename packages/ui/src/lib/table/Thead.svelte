<script>
	/**
	 * @typedef {Object<string, any>} Props
	 * @property {any} [children] The table head contents
	 * @property {string} [class] The table head class
	 * @property {boolean} [flush] The table head flush
	 */

	/** @type {Props} */
	let { children, class: cls = '', flush = false } = $props();
</script>

<thead class={['table--head', `${cls}`].join(' ')} class:table--head--flush={flush}>
	{@render children?.()}
</thead>
