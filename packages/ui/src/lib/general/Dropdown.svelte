<script>
	/**
	 * @typedef {Object<string, any>} Props
	 * @property {any} [children] The dropdown contents
	 * @property {string} [id] The dropdown id
	 * @property {string} [class] The dropdown class
	 * @property {boolean} [fullWidth] The dropdown width
	 * @property {(isOpen: boolean) => void} [onChange] The dropdown change event
	 * @property {any} [rest] The rest of the props
	 */

	let random_id = Date.now().toString(36) + Math.random().toString(36).substring(2);

	/** @type {Props} */
	let {
		children,
		class: cls = '',
		id = random_id,
		onChange,
		fullWidth = false,
		...rest
	} = $props();

	/** @type {HTMLElement | null} */
	let currentOpenDropdown = null;

	/** @type {HTMLElement | null} */
	let dropdownNode = null;

	// Update the type declaration for adjustPositionFn
	/** @type {((...args: any[]) => void) | null} */
	let adjustPositionFn = null;

	/** @type {Function | null} */
	let closeDropdownFn = null;

	/**
	 * @param {HTMLElement} node
	 */
	function handleDropdown(node) {
		dropdownNode = node;
		const button = /** @type {HTMLElement} */ (node.querySelector('.button--dropdown'));
		const dropdownContent = /** @type {HTMLElement | null} */ (
			node.querySelector('.dropdown-content')
		);

		function toggleDropdown() {
			if (currentOpenDropdown && currentOpenDropdown !== node) {
				closeDropdown(new Event('click', { bubbles: true, cancelable: true }));
			}

			node.classList.toggle('open');

			let isOpen = node.classList.contains('open');
			onChange && onChange(isOpen);

			if (node.classList.contains('open')) {
				currentOpenDropdown = node;
				adjustDropdownPosition();
				window.addEventListener('scroll', adjustDropdownPosition, true);
			} else {
				closeDropdown(new Event('click', { bubbles: true, cancelable: true }));
			}
		}

		/**
		 * @param {Event} event
		 */
		function closeDropdown(event) {
			if (!node.contains(/** @type {Node} */ (event.target))) {
				// Check if dropdown is currently open before closing it
				const wasOpen = node.classList.contains('open');

				node.classList.remove('open');
				if (dropdownContent) {
					dropdownContent.style.display = 'none';
					dropdownContent.style.visibility = 'hidden';
				}
				window.removeEventListener('scroll', adjustDropdownPosition, true);
				currentOpenDropdown = null;

				// Only trigger onChange if the dropdown was actually open before
				if (wasOpen && onChange) {
					onChange(false);
				}
			}
		}

		function adjustDropdownPosition() {
			if (!dropdownContent) return;

			dropdownContent.style.display = 'block';
			dropdownContent.style.visibility = 'hidden';

			const buttonRect = button.getBoundingClientRect();
			const nodeRect = node.getBoundingClientRect();
			const dropdownRect = dropdownContent.getBoundingClientRect();
			const availableSpaceBelow = window.innerHeight - buttonRect.bottom;
			const availableSpaceRight = window.innerWidth - buttonRect.right;

			dropdownContent.style.position = 'fixed';

			if (availableSpaceBelow < dropdownRect.height) {
				dropdownContent.style.top = `${buttonRect.top - dropdownRect.height}px`;
			} else {
				dropdownContent.style.top = `${buttonRect.bottom}px`;
			}

			if (!fullWidth && availableSpaceRight < dropdownRect.width) {
				dropdownContent.style.left = `${buttonRect.right - dropdownRect.width}px`;
			} else if (fullWidth) {
				dropdownContent.style.left = `${nodeRect.left}px`;
				dropdownContent.style.width = `${nodeRect.width}px`;
			} else {
				dropdownContent.style.left = `${buttonRect.left}px`;
			}

			dropdownContent.style.visibility = 'visible';
		}

		// Store references to these functions so they can be used by show() and hide()
		adjustPositionFn = adjustDropdownPosition;
		closeDropdownFn = closeDropdown;

		button.addEventListener('click', toggleDropdown);
		document.addEventListener('click', closeDropdown);
	}

	export function hide() {
		if (dropdownNode && dropdownNode.classList.contains('open')) {
			dropdownNode.classList.remove('open');

			const dropdownContent = /** @type {HTMLElement} */ (
				dropdownNode.querySelector('.dropdown-content')
			);
			if (dropdownContent) {
				dropdownContent.style.display = 'none';
				dropdownContent.style.visibility = 'hidden';
			}

			if (adjustPositionFn) {
				window.removeEventListener('scroll', adjustPositionFn, true);
			}

			currentOpenDropdown = null;

			// Trigger onChange callback if provided
			if (onChange) {
				onChange(false);
			}
		}
	}

	export function show() {
		if (dropdownNode && !dropdownNode.classList.contains('open')) {
			// Close any other open dropdown first
			if (currentOpenDropdown && currentOpenDropdown !== dropdownNode) {
				if (closeDropdownFn) {
					closeDropdownFn(new Event('click', { bubbles: true, cancelable: true }));
				}
			}

			dropdownNode.classList.add('open');
			currentOpenDropdown = dropdownNode;

			if (adjustPositionFn) {
				adjustPositionFn();
				window.addEventListener('scroll', adjustPositionFn, true);
			}

			// Trigger onChange callback if provided
			if (onChange) {
				onChange(true);
			}
		}
	}
</script>

<div class="dropdown {cls}" {id} {...rest} use:handleDropdown>
	{@render children?.()}
</div>
