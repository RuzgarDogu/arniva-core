<script>
	import { Icon, Input } from '$lib';
	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();

	console.log('IconList');

	let search = $state('');
	function handleSearch(event) {
		search = event.target.value.toLowerCase();
	}
	let filtered_icons = $derived.by(() => {
		if (!search) return data.icon_list;
		return data.icon_list.filter((icon) => icon.toLowerCase().includes(search));
	});
</script>

<div class="search-container">
	<h1>Icons ({data?.icon_list?.length})</h1>
	<Input placeholder="Search icons" oninput={handleSearch} />
</div>
<div class="icon-list">
	{#each filtered_icons as icon (icon)}
		<div class="icon-list-item">
			<div class="icon-list-item-icon">
				<Icon name={icon} size="24px" />
			</div>
			<div class="icon-list-item-description">{icon}</div>
		</div>
	{/each}
</div>

<style>
	.icon-list {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
		gap: 1rem;
	}
	.icon-list-item {
		display: flex;
		flex-direction: column;
		align-items: center;
		background-color: #f7f7f7;
		border-radius: 10px;
	}
	.icon-list-item-icon {
		width: 50px;
		height: 50px;
		padding: 1rem;
		display: flex;
		align-items: center;
		justify-content: center;
	}
	.search-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 2.5rem;
	}
	.search-container > * {
		width: 45%;
	}
	.icon-list-item-description {
		text-align: center;
		font-size: 0.8rem;
		padding-bottom: 0.5rem;
	}
</style>
