<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Card, CardBody } from '@ui/general';

	const { Story } = defineMeta({
		title: 'UI/General/CardBody',
		component: CardBody,
		tags: ['autodocs'],
		argTypes: {
			class: { control: { type: 'text' } }
		}
	});
</script>

<Story name="Default" args={{}}>
	{#snippet children(args)}
		<Card>
			<CardBody {...args}>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Id placeat, ullam dolore iure
				facilis, modi quos culpa commodi recusandae aperiam cum laboriosam voluptatem odit error qui
				vel illum nam delectus! Sunt accusantium sequi odit, magnam totam architecto hic qui at
				autem provident molestias molestiae aspernatur quaerat consectetur aut? Dicta, quam.
			</CardBody>
		</Card>
	{/snippet}
</Story>
