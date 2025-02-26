// @ts-nocheck
import { afterNavigate } from '$app/navigation';

let init = false;

/**
 * @typedef {Object} SvelteInstance
 * @property {function(string): void} handleStateChange
 *
 * @typedef {HTMLElement & {__svelteInstance?: SvelteInstance}} ModalElement
 */

class Modal {
	/**
	 * @param {ModalElement} element - The modal DOM element
	 * @param {number} index - The index of the modal
	 */
	constructor(element, index) {
		this.id = element.id;
		this.element = element;
		/** @type {HTMLElement | null} */
		this.dismissButton = element.querySelector('[data-ar-dismiss="modal"]');
		/** @type {HTMLElement | null} */
		this.enlargeButton = element.querySelector('[data-ar-enlarge="modal"]');
		this.isOpen = false;
		this.isEnlarged = false;
		this.lastZIndex = 0;
		this.index = index;
		const titleElement = element.querySelector('.modal--title');
		this.name =
			element.getAttribute('data-ar-name') ||
			(titleElement?.textContent ? titleElement.textContent.trim() : null) ||
			`Modal ${index + 1}`;
		this.title =
			element.getAttribute('data-ar-title') ||
			element.getAttribute('data-ar-name') ||
			'Untitled Modal';
	}

	toggleEnlarge() {
		let mainContentSection = document.querySelector('.layout__content')
		if (!mainContentSection) {
			mainContentSection = this.element;
			console.log("mainContentSection", mainContentSection)
			// If there's no parent element either, return
			if (!mainContentSection) return;
		}
		const mainContentSectionTop = mainContentSection.getBoundingClientRect().top;
		const mainContentSectionLeft = mainContentSection.getBoundingClientRect().left;
		/** @type {HTMLElement | null} */
		const modalContent = this.element.querySelector('.modal--content');

		this.isEnlarged = !this.isEnlarged;
		this.element.classList.toggle('enlarged');

		if (this.isEnlarged && mainContentSection && modalContent) {
			modalContent.style.top = `${mainContentSectionTop}px`;
			modalContent.style.left = `${mainContentSectionLeft}px`;
			// modalContent.style.left = `1px`;
			modalContent.style.right = '0';
			modalContent.style.bottom = '0';
			modalContent.style.transform = 'none';
			modalContent.style.width = `calc(100% - ${mainContentSectionLeft}px)`;
			// modalContent.style.width = `calc(100% - 1px)`;
			modalContent.style.height = `calc(100% - 1px)`;
			modalContent.style.boxShadow = 'none';
		} else {
			if (modalContent) modalContent.removeAttribute('style');
		}
	}
}

/**
 * @typedef {{type: string, handler: EventListener}} EventHandlerItem
 */

class ModalController {
	/**
	 * @constructor
	 */
	constructor() {
		/** @type {number} - Base z-index for modal stacking */
		this.zIndexCounter = 1000;

		/** @type {Modal[]} - Array of currently active modal instances */
		this.activeModals = [];

		/** @type {Map<string, Modal>} - Map of all modal instances by ID */
		this.modals = new Map();

		/** @type {WeakMap<HTMLElement, MutationObserver>} - Map of mutation observers */
		this.observers = new WeakMap();

		/** @type {Map<HTMLElement, Array<EventHandlerItem>>} - Map of event listeners */
		this.eventListeners = new Map();
	}

	// Then your destroy function can stay the same

	/**
	 * Handles enlarging a modal
	 * @param {Modal} modal - The modal to enlarge
	 */
	handleEnlarge(modal) {
		modal.toggleEnlarge();
		this.updateModalPositions();
	}
	/**
	 * @param {number} index - The index of the modal
	 */
	closeModalsAfterIndex(index) {
		const modalsToClose = this.activeModals.slice(index + 1);
		modalsToClose.forEach((modalToClose) => {
			modalToClose.element.classList.add('closing');
		});
	}

	updateBreadcrumbs() {
		this.activeModals.forEach((modal) => {
			const breadcrumbContainer = modal.element.querySelector('.modal--breadcrumb');
			if (breadcrumbContainer) {
				// Clear breadcrumbs if 1 or fewer modals
				if (this.activeModals.length <= 1) {
					breadcrumbContainer.innerHTML = '';
					return;
				}

				breadcrumbContainer.innerHTML = '';

				this.activeModals.forEach((activeModal, index) => {
					const breadcrumb = document.createElement('div');
					breadcrumb.textContent = activeModal.title || activeModal.name;
					breadcrumb.classList.add('modal--breadcrumb-item');

					const handleClick = () => {
						this.closeModalsAfterIndex(index);
					};

					breadcrumb.addEventListener('click', handleClick);

					if (!this.eventListeners.has(breadcrumb)) {
						this.eventListeners.set(breadcrumb, []);
					}

					// Get the listeners array with a definite assignment
					const listeners = this.eventListeners.get(breadcrumb);
					if (listeners) {
						listeners.push({ type: 'click', handler: handleClick });
					}

					breadcrumbContainer.appendChild(breadcrumb);

					if (index < this.activeModals.length - 1) {
						const chevron = document.createElement('div');
						chevron.innerHTML =
							'<svg width="14px" height="14px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 5L15 12L9 19" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>';
						chevron.classList.add('breadcrumb-chevron');
						breadcrumbContainer.appendChild(chevron);
					}
				});
			}
		});
	}

	/**
	 * Updates z-indices for all active modals after one is closed
	 * @param {Modal} closedModal - The modal being closed
	 */
	updateZIndices = (closedModal) => {
		const closedIndex = this.activeModals.indexOf(closedModal);
		if (closedIndex !== -1) {
			this.activeModals.splice(closedIndex, 1);
			this.activeModals.forEach((modal) => {
				if (modal.lastZIndex > closedModal.lastZIndex) {
					modal.lastZIndex--;
					modal.element.style.zIndex = String(modal.lastZIndex);
				}
			});
			this.zIndexCounter--;
			this.updateModalPositions();
		}
	};
	updateModalPositions = () => {
		const nonEnlargedModals = this.activeModals.filter((modal) => !modal.isEnlarged);
		const enlargedModals = this.activeModals.filter((modal) => modal.isEnlarged);

		this.modals.forEach((modal) => {
			/** @type {HTMLElement | null} */
			const modalContent = modal.element.querySelector('.modal--content');
			if (modalContent) {
				modalContent.style.transform = 'translate(-50%, -50%)';
			}
		});

		if (nonEnlargedModals.length > 0) {
			nonEnlargedModals.forEach((modal, index) => {
				const offset = (nonEnlargedModals.length - 1 - index) * 3;
				/** @type {HTMLElement | null} */
				const modalContent = modal.element.querySelector('.modal--content');
				if (modalContent) {
					modalContent.style.transform = `translate(-${50 + offset}%, -${50 + offset}%)`;
				}
			});
		}

		if (enlargedModals.length > 0) {
			enlargedModals.forEach((modal) => {
				/** @type {HTMLElement | null} */
				const modalContent = modal.element.querySelector('.modal--content');
				if (modalContent) {
					modalContent.style.transform = 'none';
				}
			});
		}
	};

	/**
	 * Updates z-indices for all active modals after one is closed
	 * @param {Modal} modal - The modal being closed
	 */
	observeModalState(modal) {
		if (this.observers.has(modal.element)) {
			const observer = this.observers.get(modal.element);
			if (observer) {
				observer.disconnect();
			}
		}

		const observer = new MutationObserver((mutations) => {
			for (const mutation of mutations) {
				if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
					this.handleModalStateChange(modal);
				}
			}
		});

		observer.observe(modal.element, {
			attributes: true,
			attributeFilter: ['class']
		});

		this.observers.set(modal.element, observer);
		return observer;
	}

	/**
	 * Updates z-indices for all active modals after one is closed
	 * @param {Modal} modal - The modal being closed
	 */
	handleModalStateChange(modal) {
		const classList = modal.element.classList;

		if (classList.contains('closing')) {
			this.handleModalClosing(modal);
			if (modal.element.__svelteInstance?.handleStateChange) {
				modal.element.__svelteInstance.handleStateChange('closing');
			}
		} else if (classList.contains('opening')) {
			this.handleModalOpening(modal);
		}
	}

	/**
	 * Updates z-indices for all active modals after one is closed
	 * @param {Modal} modal - The modal being closed
	 */
	handleModalClosing(modal) {
		modal.element.classList.remove('closing', 'open');
		modal.isOpen = false;
		this.updateZIndices(modal);
		modal.element.style.zIndex = '';
		modal.lastZIndex = 0;
		this.updateModalPositions();
		this.updateBreadcrumbs();
	}

	/**
	 * Updates z-indices for all active modals after one is closed
	 * @param {Modal} modal - The modal being closed
	 */
	handleModalOpening(modal) {
		modal.element.classList.remove('opening');
		modal.element.classList.add('open');
		modal.isOpen = true;
		modal.lastZIndex = ++this.zIndexCounter;
		modal.element.style.zIndex = String(modal.lastZIndex);
		this.activeModals.push(modal);
		this.updateModalPositions();
		this.updateBreadcrumbs();
	}

	cleanupEventListeners() {
		this.eventListeners.forEach((listeners, element) => {
			listeners.forEach(({ type, handler }) => {
				element.removeEventListener(type, handler);
			});
		});
		this.eventListeners = new Map(); // Reset to a new Map, not WeakMap
	}

	destroy() {
		// Handle WeakMap of observers - we need to get the elements first
		this.modals.forEach((modal) => {
			const observer = this.observers.get(modal.element);
			if (observer) {
				observer.disconnect();
			}
		});

		this.observers = new WeakMap();
		this.cleanupEventListeners();
		this.modals.clear();
		this.activeModals = [];
		this.zIndexCounter = 1000;
	}
}

// eslint-disable-next-line no-unused-vars
export function modalInit(node) {
	/** @type {ModalController|null} */
	let controller = null;

	function initializeController() {
		// Create new controller if it doesn't exist
		if (!controller) {
			controller = new ModalController();
		}
	}
	function initializeModals() {
		initializeController();
		const modalElements = Array.from(document.querySelectorAll('.modal'));

		modalElements.forEach((element, index) => {
			// Cast the element to ModalElement type
			/** @type {ModalElement} */
			const modalElement = /** @type {ModalElement} */ (element);
			const modal = new Modal(modalElement, index);

			// Now controller is definitely not null
			if (controller) controller.modals.set(modal.id, modal);

			// Rest of your code remains the same
			// Setup dismiss button
			if (modal.dismissButton) {
				const dismissHandler = () => {
					modal.element.classList.add('closing');
				};
				modal.dismissButton.addEventListener('click', dismissHandler);
				if (controller) {
					if (!controller.eventListeners.has(modal.dismissButton)) {
						controller.eventListeners.set(modal.dismissButton, []);
					}
					const listeners = controller.eventListeners;
					if (listeners) {
						let btns = listeners.get(modal.dismissButton);
						if (btns) {
							btns.push({
								type: 'click',
								handler: dismissHandler
							});
						}
					}
				}
			}

			// Setup enlarge button
			if (modal.enlargeButton) {
				const enlargeHandler = () => {
					if (!controller) return;
					controller.handleEnlarge(modal);
				};
				modal.enlargeButton.addEventListener('click', enlargeHandler);
				if (controller) {
					if (!controller.eventListeners.has(modal.enlargeButton)) {
						controller.eventListeners.set(modal.enlargeButton, []);
					}
					let btn = controller.eventListeners.get(modal.enlargeButton);
					if (btn) {
						btn.push({
							type: 'click',
							handler: enlargeHandler
						});
					}
				}
			}

			// Setup observer
			if (controller) controller.observeModalState(modal);
		});

		setupTriggerButtons();
	}

	function setupTriggerButtons() {
		const buttons = document.querySelectorAll('[data-ar-toggle="modal"]');
		buttons.forEach((button) => {
			if (!button.hasAttribute('data-ar-target')) return;

			const targetId = button.getAttribute('data-ar-target');
			// Check if targetId is not null before using it
			if (!targetId) return;

			const modal = controller && controller.modals.get(targetId);
			if (!modal) return;

			const triggerHandler = () => {
				modal.element.classList.add('opening');
			};

			button.addEventListener('click', triggerHandler);

			if (controller) {
				// Cast button to HTMLElement before using it with the event listeners map
				/** @type {HTMLElement} */
				const htmlButton = /** @type {HTMLElement} */ (button);

				if (!controller.eventListeners.has(htmlButton)) {
					controller.eventListeners.set(htmlButton, []);
				}
				let btn = controller.eventListeners.get(htmlButton);
				if (btn) {
					btn.push({
						type: 'click',
						handler: triggerHandler
					});
				}
			}
		});
	}

	// eslint-disable-next-line no-undef
	$effect(() => {
		afterNavigate(() => {
			if (!init) {
				init = true;
				initializeController();
				initializeModals();
			}
			// initializeController();
			// initializeModals();
		});

		// Return cleanup function
		return () => {
			if (controller) {
				controller.destroy();
				init = false;
			}
		};
	});

	return {
		destroy() {
			if (controller) {
				controller.destroy();
				init = false;
			}
		}
	};
}
