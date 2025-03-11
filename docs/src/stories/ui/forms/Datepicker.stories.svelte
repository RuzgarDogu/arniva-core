<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { DatePicker } from '@ui/forms';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'UI/Forms/DatePicker',
		component: DatePicker,
		tags: ['autodocs'],
		argTypes: {
			quickSelect: { control: 'boolean' },
			isRange: { control: 'boolean' }
		}
	});
</script>

<Story name="Default Datepicker" args={{}}>
	{#snippet children(args)}
		<div style="height: 350px">
			<DatePicker {...args} />
		</div>
	{/snippet}
</Story>

<Story
	name="Quick Select Example"
	args={{
		quickSelect: true
	}}
>
	{#snippet children(args)}
		<div style="height: 350px">
			<DatePicker {...args} />
		</div>
	{/snippet}
</Story>

<Story
	name="Date Range Example"
	args={{
		quickSelect: true,
		isRange: true
	}}
>
	{#snippet children(args)}
		<div style="height: 350px">
			<DatePicker {...args} />
		</div>
	{/snippet}
</Story>
