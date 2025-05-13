<script>

    /**
     * FIXME: Just for flagging edits.
    */

    import { browser } from '$app/environment';
    

    /**
     * @typedef {Object} Props
     * @property {string} [class] The class to add to the cell
     * @property {any} [children] The cell contents
     */

    /** @type {Props} */    
    let { children, class: cls = '' } = $props();

    let width = $state(0);
    /** @type {HTMLTableElement|null} */
    let parentTable = null;
    /** @type {boolean} */
    let isFixedCells = $state(false);
    /** @type {ResizeObserver|null} */
    let resizeObserver = null;

    /**
     * Calculates and maintains the width of the table cell
     * @param {HTMLTableCellElement} node - The td element
     * @returns {void|{destroy: () => void}} - Cleanup function for the action
     */
    function calculateWidth(node) {
        if(browser) {
            // Get the closest table ancestor
            parentTable = node.closest('table');
            
            // Check if the parent table has fixed cells enabled
            isFixedCells = parentTable?.classList.contains('table--fixed-cells') || false;
            
            // If fixed cells is not enabled, no need to continue
            if (!isFixedCells) return;
            
            // Initial width calculation
            setWidth(node);
            
            // Set up resize observer to handle window/table resizing
            resizeObserver = new ResizeObserver(() => {
                // Only recalculate if this is the first render
                // After that, we want to maintain the fixed width ratios
                if (width === 0) {
                    setWidth(node);
                }
            });
            
            // Observe the parent table for size changes
            if (parentTable) {
                resizeObserver.observe(parentTable);
            }
            
            // Clean up on component destruction
            return {
                destroy() {
                    if (resizeObserver) {
                        resizeObserver.disconnect();
                    }
                }
            };
        }
    }
    
    /**
     * Helper function to calculate and set the width
     * @param {HTMLTableCellElement} node - The td element
     */
    function setWidth(node) {
        if (!isFixedCells || !parentTable) return;
        
        // Get the table's total width
        const tableWidth = parentTable.offsetWidth;
        
        // Calculate the cell's current width
        const cellWidth = node.offsetWidth;
        
        // Convert to percentage (more responsive than fixed pixels)
        const widthPercentage = (cellWidth / tableWidth) * 100;
        
        // Update the state
        width = widthPercentage;
    }

    /**
     * Handles content overflow by adding ellipsis and hover text
     * @param {HTMLTableCellElement} node - The td element
     */
    function handleOverflow(node) {
        if(browser && node && isFixedCells) {
            // Add title attribute to show full text on hover for text content
            const textContent = node.textContent?.trim();
            if (textContent) {
                node.setAttribute('title', textContent);
            }

            // Force cell to maintain its width regardless of content
            node.style.overflow = 'hidden';
            node.style.textOverflow = 'ellipsis';
            node.style.whiteSpace = 'nowrap';
            
            // Check if child elements exist (could be buttons, images, etc.)
            const hasChildElements = node.children.length > 0;
            
            if (hasChildElements) {
                // For mixed content, create a wrapper for better control
                const wrapper = document.createElement('div');
                wrapper.className = 'td-content-wrapper';
                wrapper.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    width: 100%;
                `;
                
                // Move all children to wrapper
                while (node.firstChild) {
                    const child = node.firstChild;
                    if (child.nodeType === Node.ELEMENT_NODE) {
                        // Type assertion to tell JSDoc this is an HTMLElement with style property
                        /** @type {HTMLElement} */
                        const elementChild = /** @type {HTMLElement} */ (child);
                        // Special handling for interactive elements
                        if (elementChild.tagName === 'BUTTON' || elementChild.tagName === 'IMG') {
                            elementChild.style.flexShrink = '0';
                        } else {
                            elementChild.style.overflow = 'hidden';
                            elementChild.style.textOverflow = 'ellipsis';
                            elementChild.style.minWidth = '0';
                        }
                    }
                    wrapper.appendChild(child);
                }
                
                node.appendChild(wrapper);
            }
        }
    }
</script>
<td 
    class={cls} 
    use:calculateWidth 
    use:handleOverflow
    style={isFixedCells ? `
        width: ${width}%; 
        max-width: ${width}%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    ` : ''}
>
    {@render children?.()}
</td>