<script>
    /** @type {{ data: import('./$types').PageData }} */
    import { Table, Thead, Tbody, Trow, Th, Td } from '$lib';
    let { data } = $props();
    let { dummyData } = data;

    let headers = Object.keys(dummyData[0] || {});
    console.log('Headers:', headers);

</script>

    <div>
        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloremque magnam amet dicta modi, accusamus aliquid ad totam debitis impedit obcaecati facere natus, officiis libero. Aliquam, minus porro? Tempore amet molestias necessitatibus consequuntur quos vero vel, expedita ullam. Hic, eaque rerum! Consectetur facere, explicabo aspernatur architecto facilis nemo possimus officiis eum ex debitis hic quisquam voluptatibus dolorum dicta cupiditate culpa odio temporibus deleniti at nihil laborum veritatis nesciunt vitae. Officiis ab voluptas quibusdam necessitatibus suscipit dicta, id inventore consequatur optio ea? Nemo hic rerum cupiditate laudantium unde soluta sit ducimus recusandae nisi aliquam voluptate iure nesciunt officia incidunt in, enim magni?</p>
        
        <p><strong>Debug info:</strong> Headers count: {headers.length}, Data rows: {dummyData.length}</p>
        
        <h2>Table Examples with Different Sticky Column Configurations</h2>
        
        <h3>1. No Sticky Columns</h3>
        <p>Regular table with horizontal scroll - no columns are sticky.</p>
        <Table headerType="static" height="300px" scroll={true}>
            <Thead>
                <Trow>
                    {#each headers as header}
                        <Th>{header}</Th>
                    {/each}
                </Trow>
            </Thead>
            <Tbody>
                {#each dummyData.slice(0, 5) as item}
                    <Trow>
                        {#each headers as header}
                            <Td>{item[header]}</Td>
                        {/each}
                    </Trow>
                {/each}
            </Tbody>
        </Table>
        
        <h3>2. Sticky Columns at Start (3 columns)</h3>
        <p>First 3 columns (id, firstName, lastName) will stick to the left side.</p>
        <Table headerType="static" height="300px" scroll={true} stickyColumns={3}>
            <Thead>
                <Trow>
                    {#each headers as header}
                        <Th>{header}</Th>
                    {/each}
                </Trow>
            </Thead>
            <Tbody>
                {#each dummyData.slice(0, 5) as item}
                    <Trow>
                        {#each headers as header}
                            <Td>{item[header]}</Td>
                        {/each}
                    </Trow>
                {/each}
            </Tbody>
        </Table>
        
        <h3>3. Sticky Columns at End (2 columns)</h3> 
        <p>Last 2 columns (lastLogin, performanceRating) will stick to the right side.</p>
        <Table headerType="static" height="300px" scroll={true} stickyColumnsEnd={2}>
            <Thead>
                <Trow>
                    {#each headers as header}
                        <Th>{header}</Th>
                    {/each}
                </Trow>
            </Thead>
            <Tbody>
                {#each dummyData.slice(0, 5) as item}
                    <Trow>
                        {#each headers as header}
                            <Td>{item[header]}</Td>
                        {/each}
                    </Trow>
                {/each}
            </Tbody>
        </Table>
        
        <h3>4. Sticky Columns on Both Ends (2 start + 2 end)</h3>
        <p>Scroll horizontally to see both start and end columns staying fixed.</p>
        <Table headerType="static" height="300px" scroll={true} stickyColumns={2} stickyColumnsEnd={2}>
            <Thead>
                <Trow>
                    {#each headers as header}
                        <Th>{header}</Th>
                    {/each}
                </Trow>
            </Thead>
            <Tbody>
                {#each dummyData.slice(0, 5) as item}
                    <Trow>
                        {#each headers as header}
                            <Td>{item[header]}</Td>
                        {/each}
                    </Trow>
                {/each}
            </Tbody>
        </Table>
        
        <h3>5. Large Example with Mixed Sticky Columns</h3>
        <p>A larger example with first column and last two columns sticky to demonstrate real-world usage.</p>
        <Table headerType="static" height="400px" scroll={true} stickyColumns={1} stickyColumnsEnd={2}>
            <Thead>
                <Trow>
                    {#each headers as header}
                        <Th>{header}</Th>
                    {/each}
                </Trow>
            </Thead>
            <Tbody>
                {#each dummyData as item}
                    <Trow>
                        {#each headers as header}
                            <Td>{item[header]}</Td>
                        {/each}
                    </Trow>
                {/each}
            </Tbody>
        </Table>
    </div>
