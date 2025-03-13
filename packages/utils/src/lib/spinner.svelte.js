/**
 * @typedef {Object} SpinnerConfigProps
 * @property {'fixed' | 'absolute' | 'relative'} [position] - Position of the spinner
 * @property {boolean} [showBackdrop] - Whether to show a backdrop (only for fixed and absolute)
 * @property {string} [className] - Additional CSS classes to add to the spinner
 * @property {string} [id] - Custom ID for the spinner (if not provided, will be generated from name)
 * @property {string} [type] - Type of spinner (default or crescent)
 * @property {HTMLElement|string|null} [container] - Container element or selector to append the spinner to (defaults to body)
 * @property {string} [text] - Optional text to display with the spinner
 * @property {boolean} [adaptSize] - Whether to adapt the spinner size to its container
 * @property {number} [sizeFactor] - Factor to multiply container dimensions (0-1, default 0.6)
 * @property {number} [minSize] - Minimum size in pixels
 * @property {number} [maxSize] - Maximum size in pixels
 * @property {number} [sizeMargin] - Margin to subtract from container dimensions
 * @property {string} [color] - Color of the spinner's moving part
 * @property {string} [backgroundColor] - Color of the spinner's background/track
 * @property {string} [backdropColor] - Color of the backdrop (when showBackdrop is true)
 * @property {number} [backdropOpacity] - Opacity of the backdrop (0-1)
 */

/** @type {SpinnerConfigProps} */
const defaultConfig = {
	position: 'relative',
	showBackdrop: true,
	className: '',
	id: '',
	container: null,
	text: '',
	adaptSize: false,
	sizeFactor: 0.6,
	minSize: 16,
	maxSize: 60,
	sizeMargin: 10,
	color: '#3498db', // Default blue color for the spinner
	backgroundColor: 'rgba(0, 0, 0, 0.1)', // Default light gray background
	backdropColor: '#000000', // Default black backdrop
	backdropOpacity: 0.1, // Default 50% opacity
	type: 'default'
};

/**
 * Map to store active spinners by name
 * @type {Map<string, Array<Spinner>>}
 */
const activeSpinners = new Map();

class Spinner {
	/**
	 * @param {string} name - Name of the spinner
	 * @param {SpinnerConfigProps} config - Configuration options
	 */
	constructor(name, config) {
		this.name = name || 'default-spinner';
		this.config = { ...defaultConfig, ...config };
		this.element = null;
		this.backdrop = null;
		this.id =
			this.config.id || `spinner-${this.name}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
	}

	/**
	 * Resolves the container element from the configuration
	 * @returns {HTMLElement|Element|DocumentFragment} The resolved container element or document fragment
	 */
	resolveContainer() {
		const container = this.config.container;

		// If container is null or undefined, use body
		if (!container) {
			return document.body;
		}

		// If container is already an HTMLElement, use it directly
		if (container instanceof HTMLElement) {
			return container;
		}

		// If container is a string, treat it as a selector
		if (typeof container === 'string') {
			// Special case for 'body'
			if (container.toLowerCase() === 'body') {
				// If targeting body, force position to fixed
				this.config.position = 'fixed';
				return document.body;
			}

			// Check if it's an ID selector
			if (container.startsWith('#')) {
				const element = document.getElementById(container.substring(1));
				if (element) return element;
			}

			// Try as a general selector
			const elements = document.querySelectorAll(container);
			if (elements.length > 0) {
				// If it's a class selector, return all matching elements
				if (container.startsWith('.')) {
					// Create a document fragment to hold all spinners
					const fragment = document.createDocumentFragment();
					elements.forEach((el) => {
						// Clone the spinner for each element
						if (el !== this.element) {
							// We'll handle this special case in mount()
							return el;
						}
					});
					return fragment;
				}
				// Otherwise just return the first element
				return elements[0];
			}
		}

		// Fallback to body
		return document.body;
	}

	/**
	 * Adapts the spinner size based on container dimensions
	 * @param {Element|HTMLElement} container - The container element
	 * @param {HTMLElement} spinnerElement - The spinner element
	 */
	adaptSpinnerSize(container, spinnerElement) {
		if (!this.config.adaptSize || !container || !spinnerElement) return;

		// Ensure spinnerElement is HTMLElement
		if (!(spinnerElement instanceof HTMLElement)) return;

		// Get container dimensions and computed styles
		const rect = container.getBoundingClientRect();
		const computedStyle = window.getComputedStyle(container);

		// Calculate sizes based on different factors
		const containerHeight = rect.height;
		const containerWidth = rect.width;
		const fontSize = parseFloat(computedStyle.fontSize);
		const lineHeight = parseFloat(computedStyle.lineHeight) || fontSize * 1.2;
		const paddingTop = parseFloat(computedStyle.paddingTop);
		const paddingBottom = parseFloat(computedStyle.paddingBottom);

		// Calculate available height (important for inline elements)
		const contentHeight = containerHeight - paddingTop - paddingBottom;

		// Determine the best size reference to use (prevents layout shifts)
		let baseSize;
		if (contentHeight < 40) {
			// For small containers, use the smallest of these metrics to avoid layout shifts
			baseSize = Math.min(contentHeight, lineHeight, fontSize * 1.5);
		} else {
			// For larger containers, use the container dimensions
			const smallestDimension = Math.min(containerWidth, containerHeight);
			baseSize = smallestDimension - (this.config.sizeMargin || 0);
		}

		// Apply size factor
		let size = baseSize * (this.config.sizeFactor || 1);

		// Apply min/max constraints
		size = Math.max(this.config.minSize || 16, Math.min(size, this.config.maxSize || 60));

		// Apply the calculated size
		spinnerElement.style.width = `${size}px`;
		spinnerElement.style.height = `${size}px`;

		// Adjust border width based on size
		const borderWidth = Math.max(1, Math.min(4, size / 12));
		spinnerElement.style.borderWidth = `${borderWidth}px`;

		// Ensure colors are maintained when adjusting size
		spinnerElement.style.borderColor = this.config.backgroundColor || 'rgba(0, 0, 0, 0.1)';
		spinnerElement.style.borderTopColor = this.config.color || '#3498db';

		// For small containers, ensure wrapper doesn't cause layout shifts
		if (contentHeight < 40) {
			if (this.element && this.element instanceof HTMLElement) {
				// Set size constraints on wrapper
				this.element.style.width = `${size}px`;
				this.element.style.height = `${size}px`;
				this.element.classList.add('spinner-compact');
			}
		}
	}

	/**
	 * Creates the spinner DOM elements
	 */
	create() {
		// Create spinner wrapper
		this.element = document.createElement('div');
		this.element.id = this.id;
		this.element.classList.add('spinner-wrapper');

		// Add position class
		this.element.classList.add(`spinner-position-${this.config.position}`);
		if (this.config.type === 'crescent') {
			this.element.classList.add('spinner-crescent');
		}
		// Add custom classes if provided
		if (this.config.className) {
			this.config.className.split(' ').forEach((cls) => {
				if (cls && this.element) this.element.classList.add(cls);
			});
		}

		// Create spinner element
		const spinnerElement = document.createElement('div');
		spinnerElement.classList.add('spinner');

		// Apply colors from config
		spinnerElement.style.borderColor = this.config.backgroundColor || 'rgba(0, 0, 0, 0.1)';
		spinnerElement.style.borderTopColor = this.config.color || '#3498db';

		this.element.appendChild(spinnerElement);

		// Add text if provided
		if (this.config.text) {
			const textElement = document.createElement('div');
			textElement.classList.add('spinner-text');
			textElement.textContent = this.config.text;
			this.element.appendChild(textElement);
		}

		// Create backdrop for fixed or absolute positions
		if (
			(this.config.position === 'fixed' || this.config.position === 'absolute') &&
			this.config.showBackdrop
		) {
			this.backdrop = document.createElement('div');
			this.backdrop.classList.add('spinner-backdrop');
			this.backdrop.classList.add(`spinner-backdrop-${this.config.position}`);
			this.backdrop.id = `backdrop-${this.id}`;

			// Apply backdrop color and opacity from config
			this.backdrop.style.backgroundColor = this.config.backdropColor || '#000000';
			this.backdrop.style.opacity = String(this.config.backdropOpacity || 0.1);
		}
	}

	/**
	 * Adds the spinner to the DOM
	 * @returns {boolean} True if spinner was mounted, false otherwise
	 */
	mount() {
		// Get container element
		const container = this.resolveContainer();
		let mounted = false;

		// Special handling for class selectors to create spinners for each element
		if (typeof this.config.container === 'string' && this.config.container.startsWith('.')) {
			const elements = document.querySelectorAll(this.config.container);

			// If it's a single element, proceed normally
			if (elements.length === 1) {
				mounted = this.appendToContainer(elements[0]);

				// Adapt size if enabled and spinner was mounted
				if (mounted && this.config.adaptSize && this.element) {
					const spinnerElement = this.element.querySelector('.spinner');
					if (spinnerElement instanceof HTMLElement && elements[0] instanceof HTMLElement) {
						this.adaptSpinnerSize(elements[0], spinnerElement);
					}
				}
			}
			// If multiple elements, clone spinner for each one
			else if (elements.length > 1) {
				// Keep track of all created elements to add to active spinners
				/** @type {Array<Spinner>} */
				const cloneSpinners = [];

				elements.forEach((el, index) => {
					// For the first element, use the current instance
					if (index === 0) {
						const firstMounted = this.appendToContainer(el);
						mounted = firstMounted;

						// Adapt size if enabled and spinner was mounted
						if (mounted && this.config.adaptSize && this.element) {
							const spinnerElement = this.element.querySelector('.spinner');
							if (spinnerElement instanceof HTMLElement && el instanceof HTMLElement) {
								this.adaptSpinnerSize(el, spinnerElement);
							}
						}
						return;
					}

					// For remaining elements, create clones
					const cloneSpinner = new Spinner(this.name, this.config);
					cloneSpinner.create();
					const cloneMounted = cloneSpinner.appendToContainer(el);

					// Adapt size for clones if enabled and mounted
					if (cloneMounted && cloneSpinner.config.adaptSize && cloneSpinner.element) {
						const spinnerElement = cloneSpinner.element.querySelector('.spinner');
						if (spinnerElement instanceof HTMLElement && el instanceof HTMLElement) {
							cloneSpinner.adaptSpinnerSize(el, spinnerElement);

							// Only add successfully mounted spinners to the list
							cloneSpinners.push(cloneSpinner);
						}
					}
				});

				// Add all clones to active spinners
				if (cloneSpinners.length > 0) {
					if (!activeSpinners.has(this.name)) {
						activeSpinners.set(this.name, []);
					}

					if (activeSpinners) {
						let spinners = activeSpinners.get(this.name);
						if (spinners) spinners.push(...cloneSpinners);
					}
				}
			}
		} else {
			// Normal case - single container
			mounted = this.appendToContainer(container);

			// Adapt size if enabled and spinner was mounted
			if (mounted && this.config.adaptSize && this.element) {
				const spinnerElement = this.element.querySelector('.spinner');
				if (spinnerElement instanceof HTMLElement && container instanceof HTMLElement) {
					this.adaptSpinnerSize(container, spinnerElement);
				}
			}
		}

		// Add to active spinners map only if mounted
		if (mounted) {
			if (!activeSpinners.has(this.name)) {
				activeSpinners.set(this.name, []);
			}
			if (activeSpinners) {
				let spinners = activeSpinners.get(this.name);
				if (spinners) spinners.push(this);
			}
		}

		return mounted;
	}

	/**
	 * Checks if container already has a spinner as a direct child
	 * @param {Element|HTMLElement} container - The container to check
	 * @returns {boolean} True if container already has a spinner
	 */
	hasExistingSpinner(container) {
		if (!container) return false;

		// Check direct children for spinner-wrapper
		for (let i = 0; i < container.children.length; i++) {
			const child = container.children[i];
			if (child.classList && child.classList.contains('spinner-wrapper')) {
				// If we find any direct child spinner, return true
				return true;
			}
		}

		return false;
	}

	/**
	 * Appends spinner to a specific container
	 * @param {Element|HTMLElement|DocumentFragment} container - The container to append to
	 * @returns {boolean} True if spinner was appended, false if a spinner already exists
	 */
	appendToContainer(container) {
		// Skip check for DocumentFragment since it's a special case
		if (container instanceof DocumentFragment) {
			// For document fragments, we just append directly
			if (this.backdrop) {
				container.appendChild(this.backdrop);
			}

			if (this.element) {
				container.appendChild(this.element);
			}

			return true;
		}

		// For normal elements, check if container already has a spinner
		if (this.hasExistingSpinner(container)) {
			// Skip appending if spinner exists
			return false;
		}

		// Append backdrop first if it exists
		if (this.backdrop) {
			container.appendChild(this.backdrop);
		}

		// Append spinner
		if (this.element) {
			container.appendChild(this.element);
		}

		return true;
	}

	/**
	 * Removes the spinner from the DOM
	 */
	destroy() {
		// Remove backdrop if it exists
		if (this.backdrop) {
			this.backdrop.remove();
			this.backdrop = null;
		}

		// Remove spinner
		if (this.element) {
			this.element.remove();
			this.element = null;
		}

		// Remove from active spinners
		if (activeSpinners.has(this.name)) {
			const spinners = activeSpinners.get(this.name);
			if (spinners) {
				const index = spinners.indexOf(this);
				if (index !== -1) {
					spinners.splice(index, 1);
				}
			}
			// Clean up if no spinners left with this name
			if (spinners?.length === 0) {
				activeSpinners.delete(this.name);
			}
		}
	}
}

/**
 * Creates and shows a spinner with the given name and configuration
 * @param {string} name - The name identifier for the spinner
 * @param {Partial<SpinnerConfigProps>} [config={}] - Configuration options
 * @returns {string|null} The ID of the created spinner or null if not mounted
 */
function showSpinner(name = 'default', config = {}) {
	const spinner = new Spinner(name, config);
	spinner.create();
	const mounted = spinner.mount();

	// Return ID if mounted, null otherwise
	return mounted ? spinner.id : null;
}

/**
 * Hides all spinners with the given name
 * @param {string} name - The name identifier of spinners to hide
 */
function hideSpinner(name = 'default') {
	if (activeSpinners.has(name)) {
		const spinnersArray = activeSpinners.get(name);
		if (spinnersArray) {
			const spinners = [...spinnersArray];
			spinners.forEach((spinner) => spinner.destroy());
		}
	}
}

/**
 * Hides a spinner by its specific ID
 * @param {string} id - The ID of the spinner to hide
 */
function hideSpinnerById(id) {
	activeSpinners.forEach((spinners) => {
		const spinner = spinners.find((s) => s.id === id);
		if (spinner) {
			spinner.destroy();
		}
	});
}

/**
 * Gets all active spinners
 * @returns {Map<string, Array<Spinner>>} Map of active spinners
 */
function getActiveSpinners() {
	return activeSpinners;
}

const spinner = {
	show: showSpinner,
	hide: hideSpinner,
	hideById: hideSpinnerById,
	getActive: getActiveSpinners
};

export default spinner;
