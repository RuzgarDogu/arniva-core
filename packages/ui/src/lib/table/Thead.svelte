<script>
	import Icon from "../icons/Icon.svelte";

	/**
	 * @typedef {Object<string, any>} Column
	 * @property {string} [key] The column id
	 * @property {string} [label] The column label
	 * @property {boolean} [sortable] Whether the column is sortable
	 */

	/**
	 * @typedef {Object<string, any>} Props
	 * @property {any} [children] The table head contents
	 * @property {string} [class] The table head class
	 * @property {boolean} [flush] The table head flush
	 * @property {Column[]} [columns] The table head columns
	 * @property {function} [onSort] The table head sort function
	 */

	/** @type {Props} */
	let { children, class: cls = '', flush = false, columns=[], onSort } = $props();

	let sort = $state({
		/** @type {string} */
		key: '',
		/** @type {string|null} */
		order: null
	});

	/**
	 * @param {string} key The column key to sort by
	 * @param {boolean} [sortable=true] Whether the column is sortable
	 */
	function handleSort(key, sortable = true) {
		// Skip sorting if column is not sortable
		if (!sortable) return;
		
		// Handle sorting logic here
		if (sort.key === key) {
			sort.order = sort.order === 'asc' ? 'desc' : 'asc';
		} else {
			sort.key = key;
			sort.order = 'asc';
		}
		let _sort = JSON.parse(JSON.stringify(sort));
		onSort && onSort(_sort);
	}

</script>

<thead class={['table--head', `${cls}`].join(' ')}
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
</thead>

<style>
	.table--head-sortable {
		cursor: pointer;
	}
</style>
