<script>
	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	import { onMount } from 'svelte';
	import { Select } from '$lib';

	let searchData = $state([]);

	async function getData(search = '') {
		let endpoint = '/api/banks';
		if (search) {
			endpoint += `?filter=adi co ${search}`;
		}
		const response = await fetch(endpoint);
		searchData = await response.json();
		console.log('data', searchData);
	}

	onMount(async () => {
		await getData();
	});

	function onSelect(item) {
		console.log('Selected item:', item);
		selected = item.id;
	}

	function onInput(e) {
		console.log('e', e);
		getData(e);
	}

	let selected = $state(null);

	$inspect('searchData', searchData);
</script>

<Select
	serverSide
	{onInput}
	size="medium"
	placeholder="Start typing..."
	search
	data={searchData}
	{onSelect}
	disabled={!!selected}
/>

{#if selected}
	<button onclick={() => (selected = null)}>Reset</button>
{/if}
