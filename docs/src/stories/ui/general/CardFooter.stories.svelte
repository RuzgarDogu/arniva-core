<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Card, CardFooter, Button, CardBody } from '@ui/general';

	const { Story } = defineMeta({
		title: 'UI/General/CardFooter',
		component: CardFooter,
		tags: ['autodocs'],
		argTypes: {
			class: { control: { type: 'text' } },
			title: { control: { type: 'text' } },
			border: { control: { type: 'boolean' } },
			color: { control: { type: 'select', options: ['default', 'primary', 'accent', 'secondary'] } }
		}
	});
</script>

<Story name="Default" args={{}}>
	{#snippet children(args)}
		<Card>
			<CardFooter {...args}>
				<div style="display: flex; justify-content: space-between;">
					<div>
						<Button label="Submit" color="primary" size="small" />
						<Button label="Cancel" color="secondary" size="small" />
					</div>
					<Button label="Learn More" size="small" />
				</div>
			</CardFooter>
		</Card>
	{/snippet}
</Story>

<Story
	name="With Border"
	args={{
		border: true
	}}
>
	{#snippet children(args)}
		<Card>
			<CardBody>...</CardBody>
			<CardFooter {...args}>
				<div style="display: flex; justify-content: space-between;">
					<div>
						<Button label="Submit" color="primary" size="small" />
						<Button label="Cancel" color="secondary" size="small" />
					</div>
					<Button label="Learn More" size="small" />
				</div>
			</CardFooter>
		</Card>
	{/snippet}
</Story>

<Story
	name="Primary Header"
	args={{
		color: 'primary'
	}}
>
	{#snippet children(args)}
		<Card>
			<CardBody>...</CardBody>
			<CardFooter {...args}>
				<div style="display: flex; justify-content: space-between;">
					<div>
						<Button label="Submit" color="primary" size="small" />
						<Button label="Cancel" color="secondary" size="small" />
					</div>
					<Button label="Learn More" size="small" />
				</div>
			</CardFooter>
		</Card>
	{/snippet}
</Story>

<Story
	name="Accent Header"
	args={{
		color: 'accent'
	}}
>
	{#snippet children(args)}
		<Card>
			<CardBody>...</CardBody>
			<CardFooter {...args}>
				<div style="display: flex; justify-content: space-between;">
					<div>
						<Button label="Submit" color="primary" size="small" />
						<Button label="Cancel" color="secondary" size="small" />
					</div>
					<Button label="Learn More" size="small" />
				</div>
			</CardFooter>
		</Card>
	{/snippet}
</Story>

<Story
	name="Secondary Header"
	args={{
		color: 'secondary'
	}}
>
	{#snippet children(args)}
		<Card>
			<CardBody>...</CardBody>
			<CardFooter {...args}>
				<div style="display: flex; justify-content: space-between;">
					<div>
						<Button label="Submit" color="primary" size="small" />
						<Button label="Cancel" color="secondary" size="small" />
					</div>
					<Button label="Learn More" size="small" />
				</div>
			</CardFooter>
		</Card>
	{/snippet}
</Story>
