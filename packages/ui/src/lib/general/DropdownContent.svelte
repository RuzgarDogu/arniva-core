<script>
	/**
	 * @typedef {Object<string, any>} Props
	 * @property {any} [children] The dropdown content
	 * @property {string} [class] The dropdown class
	 */

	/** @type {Props} */
	let { children, class: cls = '', ...rest } = $props();
</script>

<div class={['dropdown-content', cls].join(' ')} {...rest}>
	{@render children?.()}
</div>
