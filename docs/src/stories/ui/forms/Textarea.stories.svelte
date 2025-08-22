<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Textarea } from '@ui/forms';

	const { Story } = defineMeta({
		title: 'UI/Forms/Textarea',
		component: Textarea,
		tags: ['autodocs'],
		argTypes: {
			class: { control: 'text' },
			placeholder: { control: 'text' },
			size: {
				control: { type: 'select' },
				options: ['small', 'medium', 'large']
			},
			disabled: { control: 'boolean' },
			rows: { control: 'number' },
			resize: { control: 'boolean' }
		}
	});
</script>

<Story name="Default" args={{ placeholder: 'Enter your message...', size: 'medium', rows: 4 }}>
	{#snippet children(args)}
		<Textarea {...args} />
	{/snippet}
</Story>

<Story name="Large" args={{ placeholder: 'Enter your message...', size: 'large', rows: 6 }}>
	{#snippet children(args)}
		<Textarea {...args} />
	{/snippet}
</Story>

<Story name="Disabled" args={{ placeholder: 'This textarea is disabled', disabled: true, rows: 4 }}>
	{#snippet children(args)}
		<Textarea {...args} />
	{/snippet}
</Story>
