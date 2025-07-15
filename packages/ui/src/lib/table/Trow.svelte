<script>
	/**
	 * @typedef {Object<string, any>} Props
	 * @property {any} [children] The table row contents
	 * @property {string} [class] The table row class
	 * @property {function} [onClick] The row click handler
	 */

	/** @type {Props} */
	let { children, class: cls = '', onClick, ...rest } = $props();

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
		
		// Check for button, input elements (checkbox, radio), or labels
		const clickedButton = target.closest('button');
		const clickedInput = target.closest('input');
		const clickedLabel = target.closest('label');
		
		if (clickedButton || clickedInput || clickedLabel) {
			// Do nothing if the click was on an interactive element
			return;
		}
		// Otherwise, call the row's onClick handler
		onClick?.(event);
	}
</script>

<tr class:table--row-cursor={onClick} class={['table--row', `${cls}`].join(' ')} onclick={handleRowClick} {...rest}>
	{@render children?.()}
</tr>
