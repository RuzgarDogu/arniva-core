<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Card, CardHeader, CardBody } from '@ui/general';

	const { Story } = defineMeta({
		title: 'UI/General/CardHeader',
		component: CardHeader,
		tags: ['autodocs'],
		argTypes: {
			class: { control: { type: 'text' } },
			title: { control: { type: 'text' } },
			border: { control: { type: 'boolean' } },
			color: { control: { type: 'select', options: ['default', 'primary', 'accent', 'secondary'] } }
		}
	});
</script>

<Story
	name="Default"
	args={{
		title: 'Card Title'
	}}
>
	{#snippet children(args)}
		<Card>
			<CardHeader {...args} />
		</Card>
	{/snippet}
</Story>

<Story
	name="With Border"
	args={{
		title: 'Card Title',
		border: true
	}}
>
	{#snippet children(args)}
		<Card>
			<CardHeader {...args} />
			<CardBody>...</CardBody>
		</Card>
	{/snippet}
</Story>

<Story
	name="Primary Header"
	args={{
		title: 'Card Title',
		color: 'primary'
	}}
>
	{#snippet children(args)}
		<Card>
			<CardHeader {...args} />
			<CardBody>...</CardBody>
		</Card>
	{/snippet}
</Story>

<Story
	name="Accent Header"
	args={{
		title: 'Card Title',
		color: 'accent'
	}}
>
	{#snippet children(args)}
		<Card>
			<CardHeader {...args} />
			<CardBody>...</CardBody>
		</Card>
	{/snippet}
</Story>

<Story
	name="Secondary Header"
	args={{
		title: 'Card Title',
		color: 'secondary'
	}}
>
	{#snippet children(args)}
		<Card>
			<CardHeader {...args} />
			<CardBody>...</CardBody>
		</Card>
	{/snippet}
</Story>
