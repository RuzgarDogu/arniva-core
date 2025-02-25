<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Accordion, AccordionItem } from '@ui/general';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'UI/General/AccordionItem',
		component: AccordionItem,
		tags: ['autodocs']
	});
</script>

<Story name="Default" args={{ title: 'Accordion Item 1', list: false }}>
	{#snippet children(args)}
		<Accordion>
			<AccordionItem {...args}>Lorem Ipsum</AccordionItem>
		</Accordion>
	{/snippet}
</Story>
