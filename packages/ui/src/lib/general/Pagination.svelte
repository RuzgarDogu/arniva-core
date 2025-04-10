<script>
    import Button from './Button.svelte';
    import Icon from '../icons/Icon.svelte';
    import Select from '../forms/select/Select.svelte';
    
    let { current = {
            totalItems: 999999999,
            start: 0,
            limit: 10
        }, compact = false, showEntries = true, onChange } = $props();
    
    let entries = [10, 25, 50, 100];
    let itemsPerPage = $state(current.limit || entries[0]);
    
    // Calculate the initial current page based on start and limit
    let initialPage = current.start !== undefined && current.limit 
        ? Math.floor(current.start / current.limit) + 1 
        : 1;
    
    let currentPage = $state(initialPage);

    // Effect to reset currentPage when itemsPerPage changes
    $effect(() => {
        // When itemsPerPage changes, adjust the currentPage to maintain the same start position
        if (itemsPerPage !== current.limit) {
            // Calculate new currentPage to keep viewing approximately the same data
            const currentStartItem = (currentPage - 1) * current.limit;
            currentPage = Math.floor(currentStartItem / itemsPerPage) + 1;
            // Make sure we don't exceed the total pages
            if (currentPage > Math.ceil(current.totalItems / itemsPerPage)) {
                currentPage = 1;
            }
        }
    });

    // Calculated
    let totalPages = $derived(Math.ceil(current.totalItems / itemsPerPage));
    let pageNumbers = $derived(Array.from({ length: totalPages }, (_, i) => i + 1));

    function sendToMain() {
        onChange && onChange({
            itemsPerPage,
            currentPage,
            totalPages
        });
    }


    /**
     * @typedef {Object} PageDefinition
     * @property {number | string} value - The page number or ellipsis
     * @property {'number' | 'ellipsis'} type - The type of the page (number or ellipsis)
     * @property {boolean} isActive - Whether the page is active
     */

    let availableNumbers = $derived.by(() => {
        /** @type {PageDefinition[]} */
        const result = [];
        const maxVisible = 5;
    
        if (totalPages <= maxVisible) {
            // Show all pages if there are fewer than maxVisible
            return pageNumbers.map(num => /** @type {PageDefinition} */ ({
                value: num,
                type: /** @type {'number'} */ ('number'),
                isActive: num === currentPage
            }));
        }
    
        // Always include first page
        result.push(/** @type {PageDefinition} */ ({
            value: 1,
            type: /** @type {'number'} */ ('number'),
            isActive: currentPage === 1
        }));
    
        if (currentPage > 3) {
            // Add ellipsis after first page if currentPage is not near the beginning
            result.push(/** @type {PageDefinition} */ ({
                value: '...',
                type: /** @type {'ellipsis'} */ ('ellipsis'),
                isActive: false
            }));
        }
    
        // Calculate the range around current page
        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);
    
        // Adjust to show more pages on either side if we're at the edges
        if (currentPage <= 3) {
            end = Math.min(maxVisible - 1, totalPages - 1);
        } else if (currentPage >= totalPages - 2) {
            start = Math.max(2, totalPages - maxVisible + 2);
        }
    
        // Add the middle pages
        for (let i = start; i <= end; i++) {
            result.push(/** @type {PageDefinition} */ ({
                value: i,
                type: /** @type {'number'} */ ('number'),
                isActive: i === currentPage
            }));
        }
    
        if (currentPage < totalPages - 2) {
            // Add ellipsis before last page if currentPage is not near the end
            result.push(/** @type {PageDefinition} */ ({
                value: '...',
                type: /** @type {'ellipsis'} */ ('ellipsis'),
                isActive: false
            }));
        }
    
        // Always include last page if there's more than one page
        if (totalPages > 1) {
            result.push(/** @type {PageDefinition} */ ({
                value: totalPages,
                type: /** @type {'number'} */ ('number'),
                isActive: currentPage === totalPages
            }));
        }
    
        return result;
    });


    /**
     * @param {PageDefinition} p - The page definition object
     */
    function setItem(p) {
        if (p.type === 'number' && typeof p.value === 'number') {
            currentPage = p.value;
            sendToMain();
        }
    }



    function increment() {
        if (currentPage < totalPages) {
            currentPage++;
        }
        sendToMain()
    }
    function decrement() {
        if (currentPage > 1) {
            currentPage--;
        }
        sendToMain()
    }

</script>
<div class="pagination">

    {#if showEntries}
    <Select size="medium" placeholder="Select an option" bind:value={itemsPerPage} 
        class="pagination--select" 
        onchange={() => {
            // This ensures currentPage is properly adjusted before sending to main
            sendToMain();
        }}>
        {#each entries as entry}
            <option value={entry}>{entry} Kayıt</option>
        {/each}
    </Select>
    {/if}


    <Button onClick={decrement} class="pagination--button pagination--prev" disabled={currentPage === 1}>
        <Icon icon="mdi:chevron-left" width="24" height="24" />
    </Button>

    <!-- Mobile page indicator -->
    <div class="pagination--mobile-indicator">
        {currentPage}/{totalPages}
    </div>

    {#if !compact}
        <div class="pagination--numbers">
            {#each availableNumbers as page}
            {@const isActive = page.isActive}
            {@const isEllipsis = page.type === 'ellipsis'}
            <Button
                onClick={() => setItem(page)}
                class={['pagination--button', isActive ? 'pagination--button-active' : '', isEllipsis ? 'pagination--button-ellipsis' : ''].join(' ')}
            >
                {page.value}
            </Button>
        {/each}
        </div>
    {/if}
    <Button onClick={increment} class="pagination--button pagination--next" disabled={currentPage === totalPages}><Icon icon="mdi:chevron-right" width="24" height="24" /></Button>
</div>
