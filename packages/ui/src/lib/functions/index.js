/**
 * Creates a click outside action for Svelte components
 * @param {HTMLElement} node - The HTML element to watch for outside clicks
 * @returns {{destroy: () => void}} An object with a destroy method
 */
export function clickOutside(node) {
    /**
     * Handles click events on the document
     * @param {MouseEvent} event - The click event object
     */
    const handleClick = (event) => {
        if (!node) return;
        
        // Make sure event.target is treated as an Element
        if (!(event.target instanceof Node)) return;
        
        if (!node.contains(event.target) && !event.defaultPrevented) {
            node.dispatchEvent(new CustomEvent('click_outside', { detail: node }));
        }
    };

    document.addEventListener('click', handleClick, true);

    return {
        destroy() {
            document.removeEventListener('click', handleClick, true);
        }
    };
}