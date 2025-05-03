<script>
    import Select from "$lib/forms/select/Select.svelte";

    /** @type {{ data: import('./$types').PageData }} */
    

    let details = $state('')


    let data = [
        { id: 1, adi: "John Doe" },
        { id: 2, adi: "Jane Smith" },
        { id: 3, adi: "Alice Johnson" },
        { id: 4, adi: "Bob Brown" },
        { id: 5, adi: "Charlie Davis" },
        { id: 6, adi: "Diana Evans" },
        { id: 7, adi: "Ethan Foster" },
        { id: 8, adi: "Fiona Green" },
        { id: 9, adi: "George Harris" },
        { id: 10, adi: "Hannah Ives" }
    ]

</script>

<h1>{details}</h1>

<!-- <Select
size="medium"
nameKey="adi"
placeholder="Start typing..."
search
onSelect={(e) => {
    console.log("e", e);
    }}
onInput={(e) => {
    console.log("e", e);
    }}
{data}
bind:value={details}
/> -->


<Select
nameKey="adi"
size="medium"
placeholder="Start typing..."
search
onInput={(e) => {
    console.log("searching for: ", e);
}}
onSelect={(e) => {
    console.log("e", e);
}}
data={data}
/>
<Select
size="medium"
placeholder="Start typing..."

onchange={(e) => {
    console.log("e", e);
}}
data={data}
>
{#each data as item}
    <option value={item.id}>{item.adi}</option>
{/each}
</Select>