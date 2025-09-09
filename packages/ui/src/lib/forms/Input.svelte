<script>
	/**
	 * @typedef {Object<string, any>} Props
	 * @property {string} [class]
	 * @property {boolean} [disabled]
	 * @property {any} [rest]
	 * @property {boolean} [dropdown]
	 * @property {any} [value]
	 * @property {'small' | 'medium' | 'large'} size
	 * @property {HTMLInputElement} element
	 * @property {boolean} [hasError] - Whether the input has validation errors
	 * @property {string} [errorMessage] - Error message to display
	 */

	/** @type {Props} */
	let {
		class: cls = '',
		value = $bindable(),
		disabled = false,
		size = 'medium',
		dropdown = false,
		element = $bindable(),
		hasError = false,
		errorMessage = '',
		...rest
	} = $props();

	/**
	 * @param {HTMLInputElement} node
	 */

	function checkNumeric(node) {
		let type = rest.type;
		if (type !== 'number') return;

		/**
		 * @param {KeyboardEvent} event
		 */
		function handleKeydown(event) {
			const key = event.key;
			/** @type {EventTarget | null} */
			const currentValueTarget = event?.target;

			/** @type {string} */
			const currentValue =
				currentValueTarget && 'value' in currentValueTarget ? String(currentValueTarget.value) : '';

			// Allow: backspace, delete, tab, escape, enter, home, end, left, right, decimal point
			if (
				[8, 9, 27, 13, 35, 36, 37, 39, 46].indexOf(event.keyCode) !== -1 ||
				// Allow Ctrl+A, Ctrl+C, Ctrl+V, Ctrl+X
				(event.keyCode === 65 && event.ctrlKey === true) ||
				(event.keyCode === 67 && event.ctrlKey === true) ||
				(event.keyCode === 86 && event.ctrlKey === true) ||
				(event.keyCode === 88 && event.ctrlKey === true)
			) {
				return;
			}

			// Allow decimal point only once
			if (key === '.' && currentValue.indexOf('.') === -1) {
				return;
			}

			// Allow minus only at the beginning
			if (key === '-' && currentValue.length === 0) {
				return;
			}

			// Only allow digits
			if (!/^\d$/.test(key)) {
				event.preventDefault();
			}
		}

		/**
		 * @param {ClipboardEvent} event
		 */
		function handlePaste(event) {
			event.preventDefault();
			/** @type {string} */
			const paste = event.clipboardData?.getData('text') || '';
			/** @type {string} */
			const numericValue = paste.replace(/[^0-9.-]/g, '');
			/** @type {HTMLInputElement | null} */
			const target = /** @type {HTMLInputElement | null} */ (event.target);
			if (numericValue && !isNaN(Number(numericValue)) && target) {
				target.value = numericValue;
				target.dispatchEvent(new Event('input'));
			}
		}

		node.addEventListener('keydown', handleKeydown);
		node.addEventListener('paste', handlePaste);

		return {
			destroy() {
				node.removeEventListener('keydown', handleKeydown);
				node.removeEventListener('paste', handlePaste);
			}
		};
	}
</script>

<input
	use:checkNumeric
	autocomplete="off"
	bind:value
	bind:this={element}
	class="form-input {size == 'medium' ? '' : `form-input--${size}`} {cls}"
	class:button--dropdown={dropdown}
	class:form-input--error={hasError}
	{...rest}
	{disabled}
	class:form-input--disabled={disabled}
/>

{#if hasError && errorMessage}
	<div class="form-input-error">{errorMessage}</div>
{/if}
