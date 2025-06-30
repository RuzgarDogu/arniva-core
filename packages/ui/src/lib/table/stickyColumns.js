import { browser } from '$app/environment';

/**
 * Sticky columns action for table cells
 * @param {HTMLTableCellElement} node
 * @returns {{destroy?: () => void}}
 */
export function stickyColumns(node) {
    if (!browser) return {};

    let resizeObserver;
    let mutationObserver;
    
    function updateStickyPosition() {
        const table = node.closest('table');
        
        if (!table?.classList.contains('table--sticky-columns')) {
            // Reset styles if not sticky
            node.style.position = '';
            node.style.left = '';
            node.style.right = '';
            node.style.zIndex = '';
            node.style.backgroundColor = '';
            node.style.borderRight = '';
            node.style.borderLeft = '';
            node.style.boxShadow = '';
            node.classList.remove('table--cell--sticky');
            node.classList.remove('table--cell--sticky-start');
            node.classList.remove('table--cell--sticky-end');
            return;
        }
        
        const stickyColumns = parseInt(table.style.getPropertyValue('--sticky-columns') || '0');
        const stickyColumnsEnd = parseInt(table.style.getPropertyValue('--sticky-columns-end') || '0');
        const row = node.parentElement;
        if (!row) return;
        
        const cellIndex = Array.from(row.children).indexOf(node);
        const totalColumns = row.children.length;
        
        // Check if this is a sticky column at the start
        if (cellIndex < stickyColumns) {
            let leftPosition = 0;
            
            // Calculate cumulative width of previous sticky columns
            for (let i = 0; i < cellIndex; i++) {
                const prevCell = row.children[i];
                if (prevCell && prevCell instanceof HTMLElement) {
                    leftPosition += prevCell.offsetWidth;
                }
            }
            
            // Apply sticky positioning
            node.style.position = 'sticky';
            node.style.left = `${leftPosition}px`;
            node.style.right = ''; // Clear right positioning
            node.classList.add('table--cell--sticky');
            node.classList.add('table--cell--sticky-start');
            node.classList.remove('table--cell--sticky-end');
            
            // Set z-index based on cell type and table type
            const isStaticTable = table.classList.contains('table--header-type-static');
            
            if (node.tagName === 'TH') {
                if (isStaticTable) {
                    node.style.zIndex = '300'; // Highest z-index for static table headers
                } else {
                    node.style.zIndex = '100'; // High z-index for regular table headers
                }
            } else {
                node.style.zIndex = '50'; // Lower z-index for body cells
            }
            
            // Add right border only to the last sticky start column
            if (cellIndex === stickyColumns - 1) {
                node.style.boxShadow = 'var(--ar-border-color) -1px 0px 0px inset';
            } else {
                node.style.boxShadow = '';
            }
            
            // Set up hover effect inheritance
            setupHoverEffect(node, row);
        }
        // Check if this is a sticky column at the end
        else if (cellIndex >= totalColumns - stickyColumnsEnd) {
            let rightPosition = 0;
            
            // Calculate cumulative width of subsequent sticky columns
            for (let i = cellIndex + 1; i < totalColumns; i++) {
                const nextCell = row.children[i];
                if (nextCell && nextCell instanceof HTMLElement) {
                    rightPosition += nextCell.offsetWidth;
                }
            }
            
            // Apply sticky positioning
            node.style.position = 'sticky';
            node.style.right = `${rightPosition}px`;
            node.style.left = ''; // Clear left positioning
            node.classList.add('table--cell--sticky');
            node.classList.add('table--cell--sticky-end');
            node.classList.remove('table--cell--sticky-start');
            
            // Set z-index based on cell type and table type
            const isStaticTable = table.classList.contains('table--header-type-static');
            
            if (node.tagName === 'TH') {
                if (isStaticTable) {
                    node.style.zIndex = '300'; // Highest z-index for static table headers
                } else {
                    node.style.zIndex = '100'; // High z-index for regular table headers
                }
            } else {
                node.style.zIndex = '50'; // Lower z-index for body cells
            }
            
            // Add left border only to the first sticky end column
            if (cellIndex === totalColumns - stickyColumnsEnd) {
                node.style.boxShadow = 'var(--ar-border-color) 1px 0px 0px inset';
            } else {
                node.style.boxShadow = '';
            }
            
            // Set up hover effect inheritance
            setupHoverEffect(node, row);
        } else {
            // Reset styles for non-sticky columns  
            node.style.position = '';
            node.style.left = '';
            node.style.right = '';
            node.style.zIndex = '';
            node.style.backgroundColor = '';
            node.style.borderRight = '';
            node.style.borderLeft = '';
            node.style.boxShadow = '';
            node.classList.remove('table--cell--sticky');
            node.classList.remove('table--cell--sticky-start');
            node.classList.remove('table--cell--sticky-end');
        }
    }
    
    /**
     * Set up hover effect for sticky cells to inherit from row
     * @param {HTMLElement} cell 
     * @param {HTMLElement} row 
     */
    function setupHoverEffect(cell, row) {
        // Set initial background based on cell type
        if (cell.tagName === 'TH') {
            // Check if the thead has flush class
            const thead = cell.closest('thead');
            const isFlush = thead?.classList.contains('table--head--flush');
            
            if (isFlush) {
                cell.style.backgroundColor = 'transparent';
            } else {
                cell.style.backgroundColor = 'var(--ar-light-color, #f8f9fa)';
            }
        } else {
            cell.style.backgroundColor = 'white'; // White background for sticky TD cells
        }
        
        // Listen for row hover events
        const handleMouseEnter = () => {
            if (cell.tagName === 'TH') {
                cell.style.backgroundColor = 'var(--ar-accent-color-subtle, #e9ecef)';
            } else {
                cell.style.backgroundColor = 'var(--ar-light-color, #f8f9fa)';
            }
        };
        
        const handleMouseLeave = () => {
            if (cell.tagName === 'TH') {
                // Restore original background based on flush state
                const thead = cell.closest('thead');
                const isFlush = thead?.classList.contains('table--head--flush');
                
                if (isFlush) {
                    cell.style.backgroundColor = 'transparent';
                } else {
                    cell.style.backgroundColor = 'var(--ar-light-color, #f8f9fa)';
                }
            } else {
                cell.style.backgroundColor = 'white'; // Return to white for TD cells
            }
        };
        
        // Remove existing listeners if any
        row.removeEventListener('mouseenter', handleMouseEnter);
        row.removeEventListener('mouseleave', handleMouseLeave);
        
        // Add new listeners
        row.addEventListener('mouseenter', handleMouseEnter);
        row.addEventListener('mouseleave', handleMouseLeave);
    }
    
    // Initial calculation - delay to ensure DOM is ready and table is rendered
    setTimeout(() => {
        updateStickyPosition();
        // Call again after a brief delay to ensure all elements are properly sized
        setTimeout(updateStickyPosition, 100);
    }, 0);
    
    // Set up resize observer to recalculate on table size changes
    resizeObserver = new ResizeObserver(() => {
        requestAnimationFrame(updateStickyPosition);
    });
    
    const table = node.closest('table');
    if (table) {
        resizeObserver.observe(table);
    }
    
    // Also observe window resize
    const handleResize = () => requestAnimationFrame(updateStickyPosition);
    window.addEventListener('resize', handleResize);
    
    // Mutation observer to watch for class changes
    mutationObserver = new MutationObserver(() => {
        requestAnimationFrame(updateStickyPosition);
    });
    
    if (table) {
        mutationObserver.observe(table, {
            attributes: true,
            attributeFilter: ['class', 'style']
        });
    }
    
    return {
        destroy() {
            if (resizeObserver) {
                resizeObserver.disconnect();
            }
            if (mutationObserver) {
                mutationObserver.disconnect();
            }
            window.removeEventListener('resize', handleResize);
        }
    };
}
