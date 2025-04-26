<script>
	/**
	 * @typedef {Object<string, any>} Props
	 * @property {any} [children] The table row contents
	 * @property {string} [class] The table row class
	 * @property {function} [onClick] The row click handler
	 */

	/** @type {Props} */
	let { children, class: cls = '', onClick } = $props();

	/**
	 * Handles the click event on the table row.
	 * If the click originated from a button or interactive element, it does nothing.
	 * Otherwise, it calls the onClick handler passed as a prop.
	 *
	 * @param {Event} event - The click event
	 * @returns {void}
	 */
	function handleRowClick(event) {
		// Check if the click originated from a button or interactive element
		if(!event || !event.target) return;
		
		// Cast event.target to HTMLElement to use closest method
		/** @type {HTMLElement} */
		const target = /** @type {HTMLElement} */ (event.target);
		const clickedElement = target.closest('button');
		
		if (clickedElement) {
			// Do nothing if the click was on a button
			return;
		}
		// Otherwise, call the row's onClick handler
		onClick?.(event);
	}
</script>

<tr class:table--row-cursor={onClick} class={['table--row', `${cls}`].join(' ')} onclick={handleRowClick}>
	{@render children?.()}
</tr>
