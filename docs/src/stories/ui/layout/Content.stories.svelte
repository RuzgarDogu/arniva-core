<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Content } from '@ui/layout';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'UI/Layout/Content',
		component: Content,
		tags: ['autodocs']
	});
</script>

<Story name="Light Content">
	<Content style="padding: 1rem; min-height: 250px;">
		Main content <code>(Mostly Pages)</code> come here.
	</Content>
</Story>
