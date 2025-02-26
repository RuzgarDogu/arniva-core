import {
	afterNavigate
} from '$app/navigation';

let init = false;

class Modal {
    constructor(element, index) {
        this.id = element.id;
        this.element = element;
        this.dismissButton = element.querySelector('[data-ar-dismiss="modal"]');
        this.enlargeButton = element.querySelector('[data-ar-enlarge="modal"]');
        this.isOpen = false;
        this.isEnlarged = false;
        this.lastZIndex = 0;
        this.index = index;
        this.name = element.getAttribute('data-ar-name') || 
                    element.querySelector('.modal--title')?.textContent.trim() || 
                    `Modal ${index + 1}`;
    }

    toggleEnlarge() {
        const mainContentSection = document.querySelector('.layout__content');
        const mainContentSectionTop = mainContentSection.getBoundingClientRect().top;
        const mainContentSectionLeft = mainContentSection.getBoundingClientRect().left;
        const modalContent = this.element.querySelector('.modal--content');

        this.isEnlarged = !this.isEnlarged;
        this.element.classList.toggle('enlarged');

        if (this.isEnlarged) {
            modalContent.style.top = `${mainContentSectionTop}px`;
            // modalContent.style.left = `${mainContentSectionLeft}px`;
            modalContent.style.left = `1px`;
            modalContent.style.right = '0';
            modalContent.style.bottom = '0';
            modalContent.style.transform = 'none';
            // modalContent.style.width = `calc(100% - ${mainContentSectionLeft}px)`;
            modalContent.style.width = `calc(100% - 1px)`;
            modalContent.style.boxShadow = 'none';
        } else {
            modalContent.removeAttribute('style');
        }
    }
}

class ModalController {
    constructor() {
        this.zIndexCounter = 1000;
        this.activeModals = [];
        this.modals = new Map();
        this.observers = new WeakMap();
        this.eventListeners = new WeakMap(); // Track event listeners for cleanup
    }

    handleEnlarge(modal) {
        modal.toggleEnlarge();
        this.updateModalPositions();
    }

    closeModalsAfterIndex(index) {
        const modalsToClose = this.activeModals.slice(index + 1);
        modalsToClose.forEach(modalToClose => {
            modalToClose.element.classList.add('closing');
        });
    }

    updateBreadcrumbs() {
        this.activeModals.forEach(modal => {
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
                    breadcrumb.textContent = activeModal.name;
                    breadcrumb.classList.add('modal--breadcrumb-item');
                    
                    const handleClick = () => {
                        this.closeModalsAfterIndex(index);
                    };
                    
                    breadcrumb.addEventListener('click', handleClick);
                    
                    if (!this.eventListeners.has(breadcrumb)) {
                        this.eventListeners.set(breadcrumb, []);
                    }
                    this.eventListeners.get(breadcrumb).push({ type: 'click', handler: handleClick });
                    
                    breadcrumbContainer.appendChild(breadcrumb);
                    
                    if (index < this.activeModals.length - 1) {
                        const chevron = document.createElement('div');
                        chevron.innerHTML = '<svg width="14px" height="14px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <path d="M9 5L15 12L9 19" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>';
                        chevron.classList.add('breadcrumb-chevron');
                        breadcrumbContainer.appendChild(chevron);
                    }
                });
            }
        });
    }

    updateZIndices = (closedModal) => {
        const closedIndex = this.activeModals.indexOf(closedModal);
        if (closedIndex !== -1) {
            this.activeModals.splice(closedIndex, 1);
            this.activeModals.forEach((modal, idx) => {
                if (modal.lastZIndex > closedModal.lastZIndex) {
                    modal.lastZIndex--;
                    modal.element.style.zIndex = modal.lastZIndex;
                }
            });
            this.zIndexCounter--;
            this.updateModalPositions();
        }
    };

    updateModalPositions = () => {
        const nonEnlargedModals = this.activeModals.filter(modal => !modal.isEnlarged);
        const enlargedModals = this.activeModals.filter(modal => modal.isEnlarged);

        this.modals.forEach(modal => {
            const modalContent = modal.element.querySelector('.modal--content');
            if (modalContent) {
                modalContent.style.transform = 'translate(-50%, -50%)';
            }
        });

        if (nonEnlargedModals.length > 0) {
            nonEnlargedModals.forEach((modal, index) => {
                const offset = (nonEnlargedModals.length - 1 - index) * 3;
                const modalContent = modal.element.querySelector('.modal--content');
                if (modalContent) {
                    modalContent.style.transform = `translate(-${50 + offset}%, -${50 + offset}%)`;
                }
            });
        }

        if (enlargedModals.length > 0) {
            enlargedModals.forEach(modal => {
                const modalContent = modal.element.querySelector('.modal--content');
                if (modalContent) {
                    modalContent.style.transform = 'none';
                }
            });
        }
    };

    observeModalState(modal) {
        if (this.observers.has(modal.element)) {
            this.observers.get(modal.element).disconnect();
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

    handleModalClosing(modal) {
        modal.element.classList.remove('closing', 'open');
        modal.isOpen = false;
        this.updateZIndices(modal);
        modal.element.style.zIndex = '';
        modal.lastZIndex = 0;
        this.updateModalPositions();
        this.updateBreadcrumbs();
    }
    

    handleModalOpening(modal) {
        modal.element.classList.remove('opening');
        modal.element.classList.add('open');
        modal.isOpen = true;
        modal.lastZIndex = ++this.zIndexCounter;
        modal.element.style.zIndex = modal.lastZIndex;
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
        this.eventListeners = new WeakMap();
    }

    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = new WeakMap();
        this.cleanupEventListeners();
        this.modals.clear();
        this.activeModals = [];
        this.zIndexCounter = 1000;
    }
}

export function modalInit(node) {
    let controller;

    function initializeController() {
        // Create new controller if it doesn't exist
        if (!controller) {
            controller = new ModalController();
        }
    }
    function initializeModals() {
        const modalElements = Array.from(document.querySelectorAll('.modal'));
        
        modalElements.forEach((element, index) => {
            const modal = new Modal(element, index);
            controller.modals.set(modal.id, modal);
            
            // Setup dismiss button
            if (modal.dismissButton) {
                const dismissHandler = () => {
                    modal.element.classList.add('closing');
                };
                modal.dismissButton.addEventListener('click', dismissHandler);
                
                if (!controller.eventListeners.has(modal.dismissButton)) {
                    controller.eventListeners.set(modal.dismissButton, []);
                }
                controller.eventListeners.get(modal.dismissButton).push({ 
                    type: 'click', 
                    handler: dismissHandler 
                });
            }
            
            // Setup enlarge button
            if (modal.enlargeButton) {
                const enlargeHandler = () => {
                    controller.handleEnlarge(modal);
                };
                modal.enlargeButton.addEventListener('click', enlargeHandler);
                
                if (!controller.eventListeners.has(modal.enlargeButton)) {
                    controller.eventListeners.set(modal.enlargeButton, []);
                }
                controller.eventListeners.get(modal.enlargeButton).push({ 
                    type: 'click', 
                    handler: enlargeHandler 
                });
            }
            
            // Setup observer
            controller.observeModalState(modal);
        });

        setupTriggerButtons();
    }

    function setupTriggerButtons() {
        const buttons = document.querySelectorAll('[data-ar-toggle="modal"]');
        buttons.forEach(button => {
            if (!button.hasAttribute('data-ar-target')) return;
            
            const targetId = button.getAttribute('data-ar-target');
            const modal = controller.modals.get(targetId);
            if (!modal) return;
            
            const triggerHandler = () => {
                modal.element.classList.add('opening');
            };
            
            button.addEventListener('click', triggerHandler);
            
            if (!controller.eventListeners.has(button)) {
                controller.eventListeners.set(button, []);
            }
            controller.eventListeners.get(button).push({ 
                type: 'click', 
                handler: triggerHandler 
            });
        });
    }

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