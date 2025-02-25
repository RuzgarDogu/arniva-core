<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Aside } from '@ui/layout';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'UI/Layout/Aside',
		component: Aside,
		tags: ['autodocs']
	});
</script>

<Story name="Light Aside">
	<Aside style="padding: 1rem; min-height: 250px;">Sidebar comes here</Aside>
</Story>
