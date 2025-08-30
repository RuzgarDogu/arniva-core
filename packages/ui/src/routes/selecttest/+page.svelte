<script>
	import Select from '$lib/forms/select/Select.svelte';

	/** @type {{ data: import('./$types').PageData }} */

	let details = $state('');

	let data = [
		{ id: 1, adi: 'John Doe' },
		{ id: 2, adi: 'Jane Smith' },
		{ id: 3, adi: 'Alice Johnson' },
		{ id: 4, adi: 'Bob Brown' },
		{ id: 5, adi: 'Charlie Davis' },
		{ id: 6, adi: 'Diana Evans' },
		{ id: 7, adi: 'Ethan Foster' },
		{ id: 8, adi: 'Fiona Green' },
		{ id: 9, adi: 'George Harris' },
		{ id: 10, adi: 'Hannah Ives' }
	];

	let insertableData = $state(['John Doe', 'Jane Smith', 'Alice Johnson', 'Bob Brown']);

	let selectvalue = $state('Testing Name');
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
<h1 class="mb-3">Select</h1>
<Select
	name="denemeselect"
	class="mb-3"
	nameKey="adi"
	size="medium"
	placeholder="Start typing..."
	search
	onInput={(e) => {
		console.log('searching for: ', e);
	}}
	onSelect={(e) => {
		console.log('e', e);
	}}
	{data}
/>
<Select
	size="medium"
	class="mb-3"
	placeholder="Start typing..."
	onchange={(e) => {
		console.log('e', e);
	}}
	{data}
>
	{#each data as item}
		<option value={item.id}>{item.adi}</option>
	{/each}
</Select>

<hr />
<h2>Insertable</h2>

<Select
	name="insertable"
	class="mb-3"
	size="medium"
	placeholder="Start typing..."
	search
	insertable
	onInput={(e) => {
		console.log('searching for: ', e);
	}}
	onSelect={(e) => {
		console.log('e', e);
	}}
	bind:data={insertableData}
	bind:value={selectvalue}
/>

<div class="mt-3">
	<h3>Current Data:</h3>
	<pre>{JSON.stringify(insertableData, null, 2)}</pre>
	<h3>Selected Value:</h3>
	<pre>{selectvalue}</pre>
</div>
