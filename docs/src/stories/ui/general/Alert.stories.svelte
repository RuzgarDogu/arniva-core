<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Alert } from '@ui/general';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'UI/General/Alert',
		component: Alert,
		tags: ['autodocs'],
		argTypes: {
			title: { control: 'text' },
			color: {
				control: {
					type: 'select',
					options: ['secondary', 'default', 'accent', 'success', 'danger', 'warning']
				}
			}
		}
	});
</script>

<Story name="Default Alert" args={{ title: 'Default Alert', color: 'default' }}>
	{#snippet children(args)}
		<Alert {...args}>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda ipsa, est doloribus,
			quaerat temporibus modi eveniet at debitis a reprehenderit esse consequuntur saepe voluptatum
			pariatur iusto harum rem? Quis, consequuntur.
		</Alert>
	{/snippet}
</Story>

<Story name="Accent Alert" args={{ title: 'Accent Alert', color: 'accent' }}>
	{#snippet children(args)}
		<Alert {...args}>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda ipsa, est doloribus,
			quaerat temporibus modi eveniet at debitis a reprehenderit esse consequuntur saepe voluptatum
			pariatur iusto harum rem? Quis, consequuntur.
		</Alert>
	{/snippet}
</Story>

<Story name="Success Alert" args={{ title: 'Success Alert', color: 'success' }}>
	{#snippet children(args)}
		<Alert {...args}>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda ipsa, est doloribus,
			quaerat temporibus modi eveniet at debitis a reprehenderit esse consequuntur saepe voluptatum
			pariatur iusto harum rem? Quis, consequuntur.
		</Alert>
	{/snippet}
</Story>

<Story name="Danger Alert" args={{ title: 'Danger Alert', color: 'danger' }}>
	{#snippet children(args)}
		<Alert {...args}>
			Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda ipsa, est doloribus,
			quaerat temporibus modi eveniet at debitis a reprehenderit esse consequuntur saepe voluptatum
			pariatur iusto harum rem? Quis, consequuntur.
		</Alert>
	{/snippet}
</Story>
