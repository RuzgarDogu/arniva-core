<script>
    /** @type {{ data: import('./$types').PageData }} */

    import { AdvancedFilter, Table, Tbody, Thead, Trow, Range, applyFilters, Button, Icon, Select } from '$lib';
    import { onMount } from 'svelte';
    import { convertQueryObjectToString } from '@ruzgardogu/utils';
    let { data } = $props();
    let warehouses = $state([])

    let branches = $state([])

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
        console.log(warehouses);
    }

    onMount(async () => {
        await getWarehouseData();
        await getBranchData();
    });

    function handleFilterChange(event) {
        console.log("event", event);
        const queryParams = convertQueryObjectToString(pagination, event);
        console.log("query params:", queryParams);
        
        // Call getWarehouseData with the generated query params
        getWarehouseData(queryParams);
        return;
    }

    async function getBranchData(queryParams = '') {
        console.log("query params:", queryParams);
        const requestOptions = {
            method: "GET",
            redirect: "follow"
        };

        const endpoint = `https://test-api.arniva.cloud/v1/sube${queryParams}`;
        const res = await fetch(endpoint, requestOptions);
        const result = await res.json();
        branches = result.data;
        console.log(branches);
    }


    let sube_id = $state(null);

    async function handleSearchInput(event) {
        console.log("event", event);
        const queryParams = `?offset=0&limit=100&filter=adi co ${event}`
        console.log("query params:", queryParams);
        
        
        // // Call getBranchData with the generated query params
        getBranchData(queryParams);
    }

</script>

<h1>Filter</h1>
<div class="d-flex gap-3 mb-3">
    <AdvancedFilter filterConfig={data.filterConfig} onChange={handleFilterChange} />
</div>
<div class="d-flex gap-3 mb-3">
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
</div>


<Table>
    <Thead>
        <Trow>
            <th>Name</th>
            <th>Şube</th>
        </Trow>
    </Thead>
    <Tbody>
        {#each warehouses as row, index (index)}
            <Trow onClick={() => console.log("row click", row)}>
                <td>{row.adi}</td>
                <td>{row.sube.adi}</td>
            </Trow>
        {/each}
    </Tbody>
</Table>


