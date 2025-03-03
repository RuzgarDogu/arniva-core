<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Icon, IconList } from '@ui/icons';
	import { Input } from '@ui/forms';
    
	console.log("iconList", IconList);

	const { Story } = defineMeta({
		title: 'UI/Icon/Icons',
		argTypes: {
			size: {
				control: {
					type: 'text',
				}
			},
			color: {
				control: {
					type: 'color',
				}
			},
		}
	});

    let search = $state('');
    function handleSearch(event) {
        search = event.target.value.toLowerCase();
    }
    let filtered_icons = $derived.by(() => {
        if (!search) return IconList;
        return IconList.filter(icon => icon.toLowerCase().includes(search));
    })

</script>

<Story name="Single Icon" exportName="SingleIcon" args={{
	size: '64px',
	color: '#545454',
	name: '4k'
}}>
    {#snippet children(args)}
		<Icon {...args}/>
    {/snippet}
</Story>

<Story name="Icons" exportName="Icons" args={{
	size: '36px',
	color: '#545454',
}}>
    {#snippet children(args)}

	<div class="search-container">
		<h1>Icons ({IconList?.length})</h1>
		<Input placeholder="Search icons" oninput={handleSearch} />
	</div>
	<div class="icon-list">
		{#each filtered_icons as icon (icon)}
		<div class="icon-list-item">
			<div class="icon-list-item-icon">
				<Icon name={icon} {...args}/>
			</div>
			<div class="icon-list-item-description">{icon}</div>
		</div>
		{/each}
	</div>
    {/snippet}
</Story>


<style>
    .icon-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
		max-height: 900px;
		overflow-y: auto;
    }
    .icon-list-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: #f7f7f7;
        border-radius: 10px;
    }
    .icon-list-item-icon {
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