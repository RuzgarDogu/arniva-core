/**
 * @typedef {Object} ConfigProps
 * @property {'info' | 'success' | 'primary' | 'danger' | 'warning' | 'error' | 'default'} type
 * @property {number} timeout
 * @property {'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'} position
 * @property {boolean} showCloseButton
 * @property {boolean} closeOnClick
 * @property {boolean} pauseOnHover
 * @property {boolean} showProgressBar
 * @property {'bounce' | 'slide' | 'fade'} transition
 * @property {number} transitionDuration
 * @property {string} message
 * @property {string} title
 */

/** @type {ConfigProps} */
const defaultConfig = {
	type: 'info',
	timeout: 3000,
	position: 'top-right',
	showCloseButton: true,
	closeOnClick: true,
	pauseOnHover: true,
	showProgressBar: true,
	transition: 'slide',
	transitionDuration: 300,
	message: '',
	title: ''
};

class Toast {
	constructor(/** @type {ConfigProps} config  */ config) {
		this.config = config || defaultConfig;
		this.parent = this.assignParent();
		this.element = null;
	}

	assignParent() {
		const position = this.config.position;
		const containerClass = `toast-container--${position}`;
		let parent = document.querySelector(`.${containerClass}`);
		if (!parent) {
			parent = document.createElement('div');
			parent.classList.add('toast-container', containerClass);
			document.body.appendChild(parent);
			return parent;
		}
		return parent;
	}

	create() {
		// Create the main element
		this.element = document.createElement('div');
		this.element.classList.add(
			'toast',
			`toast--${this.config.type}`,
			`toast--transition-${this.config.transition}`
		);

		// Set the transition duration as a CSS variable
		this.element.style.setProperty('--transition-duration', `${this.config.transitionDuration}ms`);

		/**
		 * Helper function to create elements conditionally
		 * @param {boolean|string} condition - The condition to evaluate
		 * @param {string} template - The HTML template to return if condition is truthy
		 * @returns {string} The template if condition is truthy, otherwise empty string
		 */
		const createComponent = (condition, template) => (condition ? template : '');
		// Component templates
		const titleComponent = createComponent(
			this.config.title,
			`<div class="toast--title">${this.config.title}</div>`
		);

		const closeButtonComponent = createComponent(
			this.config.showCloseButton,
			`<button class="toast--close-button">
                <svg width="16px" height="16px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>
            </button>`
		);

		const messageComponent = createComponent(
			this.config.message,
			`<div class="toast--message">${this.config.message}</div>`
		);

		const progressBarComponent = createComponent(
			this.config.showProgressBar,
			`<div class="toast--progress-bar"></div>`
		);

		// Building larger sections
		const hasHeader = !!this.config.title;
		const headerComponent = createComponent(
			hasHeader,
			`<div class="toast--header">
                ${titleComponent}
                ${closeButtonComponent}
            </div>`
		);

		const hasBody = !!this.config.message;
		const bodyComponent = createComponent(
			hasBody,
			`<div class="toast--body">
                ${messageComponent}
                ${!hasHeader ? closeButtonComponent : ''}
            </div>`
		);

		// Assemble the complete toast
		this.element.innerHTML = headerComponent + bodyComponent + progressBarComponent;

		// Add event listeners after creating HTML content
		setTimeout(() => {
			// Add close button functionality
			const closeButton = this.element?.querySelector('.toast--close-button');
			if (closeButton) {
				closeButton.addEventListener('click', () => {
					this.destroy();
				});
			}

			// Add click-to-close functionality if enabled
			if (this.config.closeOnClick) {
				this.element?.addEventListener('click', (e) => {
					// Prevent close when clicking on close button (already handled)
					/** @type {HTMLElement|null} */
					let target = /** @type {HTMLElement|null} */ (e.target);
					if (target && !target.closest('.toast--close-button')) {
						this.destroy();
					}
				});
			}
		}, 0);
	}

	mount() {
		if (this.parent) {
			this.element && this.parent.appendChild(this.element);

			// Trigger animation by adding the 'show' class after a small delay
			// This ensures the initial state is properly applied first
			setTimeout(() => {
				this.element && this.element.classList.add('show');
			}, 10);
		}
	}

	destroy() {
		if (this.element) {
			// Add the hide class to trigger the exit animation
			this.element.classList.remove('show');
			this.element.classList.add('hide');

			// Wait for the animation to complete before removing the element
			setTimeout(() => {
				this.element && this.element.remove();
			}, this.config.transitionDuration);
		}
	}

	show() {
		// First create the toast element
		setTimeout(() => {
			this.create();
			// Then mount it once created
			setTimeout(() => {
				this.mount();
				if (this.config.showProgressBar) {
					this.applyProgressBar();
				}

				// Implementation of pauseOnHover
				if (this.config.pauseOnHover) {
					this.setupPauseOnHover();
				} else {
					// Set timeout to destroy the toast after specified time
					setTimeout(() => {
						this.destroy();
					}, this.config.timeout);
				}
			}, 50);
		}, 100);
	}

	setupPauseOnHover() {
		if (!this.element) return;

		let timeLeft = this.config.timeout;
		/** @type {ReturnType<typeof setTimeout>} */
		let timeoutId;
		/** @type {number} */
		let startTime;

		// Set initial timeout
		timeoutId = setTimeout(() => {
			this.destroy();
		}, timeLeft);

		startTime = Date.now();

		this.element.addEventListener('mouseenter', () => {
			// Clear the current timeout
			clearTimeout(timeoutId);

			// Calculate remaining time
			timeLeft -= Date.now() - startTime;

			// Pause progress bar animation if it exists
			const progressBar = this.element ? this.element.querySelector('.toast--progress-bar') : null;
			if (progressBar) {
				// We need to modify the ::before pseudo-element's animation
				/** @type {HTMLElement} */ (progressBar).style.setProperty(
					'--animation-play-state',
					'paused'
				);
			}
		});

		this.element.addEventListener('mouseleave', () => {
			// Reset start time
			startTime = Date.now();

			// Create new timeout with remaining time
			timeoutId = setTimeout(() => {
				this.destroy();
			}, timeLeft);

			// Resume progress bar animation
			const progressBar = this.element ? this.element.querySelector('.toast--progress-bar') : null;
			if (progressBar) {
				// Resume the animation
				/** @type {HTMLElement} */ (progressBar).style.setProperty(
					'--animation-play-state',
					'running'
				);
			}
		});
	}

	applyProgressBar() {
		const progressBar = this.element ? this.element.querySelector('.toast--progress-bar') : null;

		if (!progressBar) return;

		// Add CSS variables to the progress bar to control the animation
		/** @type {HTMLElement} */ (progressBar).style.setProperty(
			'--progress-duration',
			`${this.config.timeout}ms`
		);
		/** @type {HTMLElement} */ (progressBar).style.setProperty('--animation-play-state', 'running');

		// Add the 'animate' class to start the animation
		progressBar.classList.add('animate');
	}
}

/**
 * Creates a toast with the given configuration
 * @param {Partial<ConfigProps>} config - Configuration options for the toast
 */
function createToast(config = {}) {
	let mergedConfig = {
		...defaultConfig,
		...config
	};
	const toastInstance = new Toast(/** @type {ConfigProps} */ (mergedConfig));
	toastInstance.show();
}

/**
 * Creates a helper function for specific toast types
 * @param {'info' | 'success' | 'primary' | 'danger' | 'warning' | 'error' | 'default'} type - The type of toast to create
 * @returns {function(string|Object, Object=): void} A function that creates a toast with the specified type
 */
function createToastHelper(type) {
	/**
	 * Creates a toast with a specific message and config
	 * @param {string|Partial<ConfigProps>} message - The message to display or config object
	 * @param {Partial<ConfigProps>} [config={}] - Additional configuration options
	 * @throws {Error} If no message is provided in either parameter
	 */
	return function (message = '', config = {}) {

		// Exit silently if not in browser environment
		if (typeof document === 'undefined') {
			return;
		}

		try {
			// Case 1: First parameter is an object (config with message inside)
			if (typeof message === 'object') {
				const configObj = message;

				// Check if message exists in the config object
				if (!configObj.message) {
					throw new Error('Toast message is required');
				}

				createToast({
					type: type,
					...configObj
				});
			}
			// Case 2: First parameter is a string (message) and second is config object
			else {
				if (!message) {
					throw new Error('Toast message is required');
				}

				createToast({
					message: message,
					type: type,
					...config
				});
			}
		} catch (error) {
			// Use type assertion after catching the error
			console.error('Toast Error:', /** @type {Error} */ (error).message);
			// Optionally create a toast notification about the error
			createToast({
				message: 'Failed to display toast: ' + /** @type {Error} */ (error).message,
				type: 'danger',
				timeout: 3000
			});
		}
	};
}

const toast = {
	show: createToastHelper('default'),
	success: createToastHelper('success'),
	warning: createToastHelper('warning'),
	danger: createToastHelper('danger'),
	info: createToastHelper('info')
};

export default toast;
