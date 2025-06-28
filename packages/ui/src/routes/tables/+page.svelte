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
        
        <div style="border: 2px solid red; width: 600px; margin: 20px 0; overflow-x: auto;">
            <p>Test Container (600px wide) - should show horizontal scroll:</p>
            <table style="width: 2000px; border: 1px solid blue;">
                <thead>
                    <tr>
                        <th style="min-width: 120px; background: yellow;">Col 1</th>
                        <th style="min-width: 120px; background: yellow;">Col 2</th>
                        <th style="min-width: 120px; background: yellow;">Col 3</th>
                        <th style="min-width: 120px;">Col 4</th>
                        <th style="min-width: 120px;">Col 5</th>
                        <th style="min-width: 120px;">Col 6</th>
                        <th style="min-width: 120px;">Col 7</th>
                        <th style="min-width: 120px;">Col 8</th>
                        <th style="min-width: 120px;">Col 9</th>
                        <th style="min-width: 120px;">Col 10</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="min-width: 120px; background: yellow;">Data 1</td>
                        <td style="min-width: 120px; background: yellow;">Data 2</td>
                        <td style="min-width: 120px; background: yellow;">Data 3</td>
                        <td style="min-width: 120px;">Data 4</td>
                        <td style="min-width: 120px;">Data 5</td>
                        <td style="min-width: 120px;">Data 6</td>
                        <td style="min-width: 120px;">Data 7</td>
                        <td style="min-width: 120px;">Data 8</td>
                        <td style="min-width: 120px;">Data 9</td>
                        <td style="min-width: 120px;">Data 10</td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div style="border: 2px solid green; width: 600px; margin: 20px 0;">
            <p>Arniva Table Test (flush=true):</p>
            <Table scroll={true} stickyColumns={3}>
                <Thead flush>
                    <Trow>
                        {#each headers as header}
                            <Th>{header}</Th>
                        {/each}
                    </Trow>
                </Thead>
                <Tbody>
                    {#each dummyData.slice(0, 3) as item}
                        <Trow>
                            {#each headers as header}
                                <Td>{item[header]}</Td>
                            {/each}
                        </Trow>
                    {/each}
                </Tbody>
            </Table>
        </div>
        
        <div style="border: 2px solid blue; width: 600px; margin: 20px 0;">
            <p>Arniva Table Test (flush=false - default):</p>
            <Table scroll={true} stickyColumns={3}>
                <Thead>
                    <Trow>
                        {#each headers as header}
                            <Th>{header}</Th>
                        {/each}
                    </Trow>
                </Thead>
                <Tbody>
                    {#each dummyData.slice(0, 3) as item}
                        <Trow>
                            {#each headers as header}
                                <Td>{item[header]}</Td>
                            {/each}
                        </Trow>
                    {/each}
                </Tbody>
            </Table>
        </div>
        
        <Table headerType="static" height="400px" scroll={true} stickyColumns={3}>
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
