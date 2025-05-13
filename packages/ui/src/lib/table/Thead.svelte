<script>

	/**
	 * @typedef {Object<string, any>} Props
	 * @property {any} [children] The table head contents
	 * @property {string} [class] The table head class
	 * @property {boolean} [flush] The table head flush
	 * @property {Column[]} [columns] The table head columns
	 * @property {function} [onSort] The table head sort function
	 */

	/** @type {Props} */
	let { children, class: cls = '', flush = false, onSort } = $props();

	/**
	 * @param {string} key The column key to sort by
	 * @param {'asc'|'desc'} [order='asc'] The sort order
	 */
	function handleSort(key, order='asc') {
		if (onSort) {
			let sort = {
				key: key,
				order: order
			};
			onSort(sort);
		}
	}

	/**
	 * @param {HTMLElement} node The table head element
	 * @returns {{destroy: () => void}} The destroy function
	 */
	function tableSort(node) {
		/**
		 * @param {MouseEvent} event The click event
		 */
		function handleClick(event) {
			if(!event.target) return;
			/** @type {HTMLElement|null} */
			const target = /** @type {HTMLElement} */ (event.target).closest('th');
			if (target) {
				const key = target.getAttribute('data-cell-key');
				const sortable = target.getAttribute('data-cell-sortable') !== 'false';
				
				if (sortable && key) {
					// Get all sortable th elements
					const allSortableHeaders = node.querySelectorAll('th[data-cell-sortable="true"]');
					
					// Reset sort order for all other headers
					allSortableHeaders.forEach(header => {
						if (header !== target) {
							header.setAttribute('data-cell-sort-order', '');
						}
					});
					
					// Change data-cell-sort-order of the target
					const oldorder = target.getAttribute('data-cell-sort-order');
					/** @type {'asc'|'desc'} */
					let order = oldorder === 'asc' ? 'desc' : 'asc';
					
					target.setAttribute('data-cell-sort-order', order);
					handleSort(key, order);
				}
			}
		}
	
		// Add event listener for sorting
		node.addEventListener('click', handleClick);
	
		return {
			/**
			 * @returns {void}
			 */
			destroy() {
				node.removeEventListener('click', handleClick);
			}
		};
	}

</script>
<thead class={['table--head', `${cls}`].join(' ')}
	class:table--head--flush={flush}
	use:tableSort
	>
	{@render children?.()}
</thead>

<!-- <thead class={['table--head', `${cls}`].join(' ')}
	class:table--head--flush={flush}
	class:table--head--sortable={columns?.length > 0 && onSort}
	>
	
	{#if columns?.length > 0 && onSort}
	<tr class="table--head-row">
		{#each columns as column (column.key)}
			 <th class="table--head-cell" onclick={() => handleSort(column.key, column.sortable !== false)}
				class:table--head--cell--sortable={column.sortable !== false}
			    >
				<div class="table--head--cell-content">
					{column.label}
					{#if column.sortable !== false}
						{#if sort.key === column.key}
							{#if sort.order === 'asc'}
								<Icon icon="mdi:caret-up" width="24" height="24" color="var(--ar-primary-color)"/>
							{:else}
								<Icon icon="mdi:caret-down" width="24" height="24" color="var(--ar-primary-color)"/>
							{/if}
						{/if}
					{/if}	
				</div>
			</th>
		{/each}
	</tr>
	{:else}
		{@render children?.()}
	{/if}
</thead> -->