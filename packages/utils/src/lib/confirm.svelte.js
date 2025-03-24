/**
 * @typedef {Object} ConfirmProps
 * @property {string} title - The title of the confirm dialog
 * @property {string} text - The main message text
 * @property {boolean} [icon=true] - Icon to display
 * @property {string} [info] - Additional information text
 * @property {string} [confirmText='Yes'] - Text for the confirm button
 * @property {string} [cancelText='No'] - Text for the cancel button
 * @property {string} [position='center'] - Position of the dialog
 * @property {'bounce' | 'slide' | 'fade'} [transition='fade'] - Animation type
 * @property {number} [transitionDuration=300] - Duration of the transition animation
 */

/** @type {ConfirmProps} */
const defaultConfig = {
  title: 'Confirm',
  text: 'Are you sure?',
  icon: true,
  info: '',
  confirmText: 'Yes',
  cancelText: 'No',
  position: 'center',
  transition: 'slide',
  transitionDuration: 300
};

class Confirm {
  /**
   * Creates a confirm dialog with the specified configuration
   * @param {Partial<ConfirmProps>} config - Configuration for the confirm dialog
   */
  constructor(config = {}) {
    this.config = { ...defaultConfig, ...config };
    this.element = null;
    this.overlay = null;
    this.promise = null;
    this.resolvePromise = null;
  }

  /**
   * Creates the DOM elements for the confirm dialog
   * @private
   */
  create() {
    // Create overlay
    this.overlay = document.createElement('div');
    this.overlay.classList.add('confirm');
    
    // Create the main element
    this.element = document.createElement('div');
    this.element.classList.add(
      'confirm--dialog',
      `confirm--transition-${this.config.transition}`
    );
    
    // Set transition duration
    this.element.style.setProperty('--transition-duration', `${this.config.transitionDuration}ms`);
    
    // Create dialog content
    const iconComponent = this.config.icon ? 
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...$$props}>
	<path fill="currentColor" d="M10 19h3v3h-3zm2-17c5.35.22 7.68 5.62 4.5 9.67c-.83 1-2.17 1.66-2.83 2.5C13 15 13 16 13 17h-3c0-1.67 0-3.08.67-4.08c.66-1 2-1.59 2.83-2.25C15.92 8.43 15.32 5.26 12 5a3 3 0 0 0-3 3H6a6 6 0 0 1 6-6" />
</svg>` : '';
    
    const titleComponent = this.config.title ? 
      `<div class="confirm--title">${this.config.title}</div>` : '';
    
    const textComponent = this.config.text ? 
      `<div class="confirm--text">${this.config.text}</div>` : '';
    
    const infoComponent = this.config.info ? 
      `<div class="confirm--info">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" {...$$props}>
	<path fill="currentColor" d="M11 15h2v2h-2zm0-8h2v6h-2zm1-5C6.47 2 2 6.5 2 12a10 10 0 0 0 10 10a10 10 0 0 0 10-10A10 10 0 0 0 12 2m0 18a8 8 0 0 1-8-8a8 8 0 0 1 8-8a8 8 0 0 1 8 8a8 8 0 0 1-8 8" />
</svg>
      ${this.config.info}</div>` : '';
    
    const buttonComponent = `
      <div class="confirm--buttons">
        <button class="confirm--cancel-btn">${this.config.cancelText}</button>
        <button class="confirm--confirm-btn">${this.config.confirmText}</button>
      </div>
    `;
    
    // Assemble dialog
    this.element.innerHTML = `
      <div class="confirm--content">
      <div class="confirm--header">
      ${titleComponent}
      ${iconComponent}
        </div>
        ${textComponent}
        ${infoComponent}
        ${buttonComponent}
      </div>
    `;
    
    // Append to overlay
    this.overlay.appendChild(this.element);
  }

  /**
   * Adds event listeners to the dialog buttons
   * @private
   */
  setupEventListeners() {
    if(!this.element) return;
    const confirmBtn = this.element.querySelector('.confirm--confirm-btn');
    const cancelBtn = this.element.querySelector('.confirm--cancel-btn');
    
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        this.destroy(true);
      });
    }
    
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        this.destroy(false);
      });
    }
    
    // Close on overlay click (optional)
    if(!this.overlay) return;
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay) {
        this.destroy(false);
      }
    });
  }

  /**
   * Mounts the dialog to the DOM
   * @private
   */
  mount() {
    if(!this.overlay || !this.element) return;
    document.body.appendChild(this.overlay);
    
    // Force reflow to ensure CSS transitions work
    void this.element.offsetWidth;
    
    // Add show classes
    this.overlay.classList.add('show');
    this.element.classList.add('show');
  }

  /**
   * Removes the dialog from the DOM
   * @param {boolean} result - The result to resolve the promise with
   * @private
   */
  destroy(result) {
    if(!this.overlay || !this.element) return;
    // Add hide classes
    this.overlay.classList.remove('show');
    this.element.classList.remove('show');
    this.overlay.classList.add('hide');
    this.element.classList.add('hide');
    
    // Remove from DOM after animation
    setTimeout(() => {
      if (this.overlay && this.overlay.parentNode) {
        this.overlay.parentNode.removeChild(this.overlay);
      }
      // Resolve the promise with the result
      if (this.resolvePromise) {
        this.resolvePromise(result);
      }
    }, this.config.transitionDuration);
  }

  /**
   * Shows the confirm dialog and returns a promise that resolves to the user's choice
   * @returns {Promise<boolean>} A promise that resolves to true if confirmed, false otherwise
   */
  show() {
    // Exit silently if not in browser environment
    if (typeof document === 'undefined') {
      return Promise.resolve(false);
    }
    
    this.create();
    this.setupEventListeners();
    
    // Create and store the promise and resolver
    this.promise = new Promise(resolve => {
      this.resolvePromise = resolve;
    });
    
    // Mount the dialog
    this.mount();
    
    return this.promise;
  }
}

/**
 * Creates and shows a confirm dialog
 * @param {Partial<ConfirmProps>|string} configOrText - Configuration object or text string
 * @returns {Promise<boolean>} A promise that resolves to true if confirmed, false otherwise
 */
function confirm(configOrText = {}) {
  let config = {};
  
  if (typeof configOrText === 'string') {
    config = { text: configOrText };
  } else {
    config = configOrText;
  }
  
  const confirmInstance = new Confirm(config);
  return confirmInstance.show();
}

export default confirm;