<script>
    import { AdvancedFilter, Table, Tbody, Thead, Trow, Range, applyFilters, Button, Pagination } from '$lib';
    // import Pagination from './Pagination.svelte';
	import { goto, invalidateAll } from '$app/navigation';
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
    let tableData = $derived.by(() => {
		return applyFilters(data.comments, {}, data.filterConfig);
	});

	function handleChange(fields) {
		console.log("fields", fields);
		// tableData = applyFilters(data.comments, fields, data.filterConfig);
	}

	function changeUrlParams(e) {
		console.log("e", e);
		const { itemsPerPage, currentPage } = e;
		const params = new URLSearchParams(window.location.search);
		
		// Calculate the start index based on current page and items per page
		const startIndex = (currentPage - 1) * itemsPerPage;
		
		params.set('limit', itemsPerPage);
		params.set('start', startIndex);
		goto(`?${params.toString()}`);
	}

	// const tableData = $state(data.comments);
	// console.log("tableData", tableData);

	// function handleChange(fields) {
	//     console.log("fields", fields);
	//     tableData = applyFilters(data.comments, fields, data.filterConfig);
	// }


</script>

<div class="d-flex mb-3">
    <h1>Filter</h1>
    <Pagination current={data.currentPagination} onChange={changeUrlParams}/>
</div>
<div class="d-flex gap-3 mb-3">
	<AdvancedFilter filterConfig={data.filterConfig} onChange={handleChange} />
</div>

<Table>
	<Thead>
		<Trow>
			<th>ID</th>
            <th>Post ID</th>
			<th>Name</th>
			<th>Email</th>
			<th>PhoneBody</th>
		</Trow>
	</Thead>
	<Tbody>
		{#each tableData as row}
			<Trow>
				<td>{row.id}</td>
				<td>{row.postId}</td>
				<td>{row.name}</td>
				<td>{row.email}</td>
				<td>{row.body}</td>
			</Trow>
		{/each}
	</Tbody>
</Table>

<style>
	.d-flex {
		display: flex;
        align-items: center;
        justify-content: space-between;
	}
	.gap-3 {
		gap: 1rem;
	}
    .mb-3 {
        margin-bottom: 1rem;
    }

</style>