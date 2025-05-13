<script>
    /** @type {{ data: import('./$types').PageData }} */

    import { AdvancedFilter, Table, Tbody, Thead, Trow, Th, Td, Range, applyFilters, Button, Icon, Select } from '$lib';
    import { onMount } from 'svelte';
    import { convertQueryObjectToString } from '@ruzgardogu/utils';
    // import { convertQueryObjectToString } from './converttest';
    
    let { data } = $props();
    let warehouses = $state([])

    let branches = $state([])

    let filter = $state({}) // Changed from null to empty object
    let sort = $state(null)
    let pagination = $state({
        offset: 0,
        limit: 10
    });
    
    async function getWarehouseData(queryParams = '') {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        const endpoint = `https://test-api.arniva.cloud/v1/depo${queryParams}`;
        const res = await fetch(endpoint, requestOptions);
        const result = await res.json();
        warehouses = result.data;
        console.log("warehouses", warehouses);
    }

    onMount(async () => {
        await getWarehouseData();
        await getBranchData();
    });

    function handleFilterChange(event) {
        console.log("event", event);
        filter = event || {}; // Ensure filter is always an object
        const queryParams = convertQueryObjectToString(pagination, filter, sort);
        
        // Call getWarehouseData with the generated query params
        getWarehouseData(queryParams);
        return;
    }

    async function getBranchData(queryParams = '') {
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        const endpoint = `https://test-api.arniva.cloud/v1/sube${queryParams}`;
        const res = await fetch(endpoint, requestOptions);
        const result = await res.json();
        branches = result.data;
    }


    let sube_id = $state(null);

    async function handleSearchInput(event) {
        const queryParams = `?offset=0&limit=100&filter=adi co ${event}`
        
        
        // // Call getBranchData with the generated query params
        getBranchData(queryParams);
    }

    function handleSort(event) {
        sort = event;
        console.log("sort", sort);
        // Ensure filter is always an object
        const queryParams = convertQueryObjectToString(pagination, filter || {}, sort);
        console.log("queryParams", queryParams);
        // Call getWarehouseData with the generated query params
        getWarehouseData(queryParams);
        return;
    }

</script>

<h1>Filter</h1>
<div class="d-flex gap-3 mb-3">
    <AdvancedFilter filterConfig={data.filterConfig} onChange={handleFilterChange} />
</div>
<!-- <div class="d-flex gap-3 mb-3">
    <Select
    nameKey="adi"
    serverSide
    size="medium"
    placeholder="Start typing..."
    search
    onInput={handleSearchInput}
    data={branches}
    bind:value={sube_id}
/>
</div> -->


<Table fixedCells>
    <!-- <Thead columns={
    [
        { key: 'adi', label: 'Name', sortable: true },
        { key: 'sube.adi', label: 'Şube', sortable: false }
    ]
    } onSort={handleSort}/> -->
     <Thead onSort={handleSort}>
        <Trow>
            <Th key="adi">Adi</Th>
            <Th key="id">ID</Th>
            <Th>Sube Adi</Th>
        </Trow>
     </Thead>
    <Tbody>
        {#each warehouses as row, index (index)}
            <Trow onClick={() => console.log("row click", row)}>
                <Td>{row.adi}</Td>
                <Td>{row.id}</Td>
                <Td>{row.sube.adi}</Td>
            </Trow>
        {/each}
    </Tbody>
</Table>


