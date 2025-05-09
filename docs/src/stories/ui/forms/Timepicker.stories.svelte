<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { TimePicker } from '@ui/forms';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'UI/Forms/TimePicker',
		component: TimePicker,
		tags: ['autodocs'],
		argTypes: {
			value: { control: 'text' }
		}
	});
</script>

<Story name="Default TimePicker" args={{}}>
	{#snippet children(args)}
		<div style="height: 350px">
			<TimePicker {...args} />
		</div>
	{/snippet}
</Story>

<Story
	name="With Default Value"
	args={{
		value: "12:30:45"
	}}
>
	{#snippet children(args)}
		<div style="height: 350px">
			<TimePicker {...args} />
		</div>
	{/snippet}
</Story>

<Story
	name="With Turkish Labels"
	args={{
		translation: {
			hour: 'sa',
			minute: 'dk',
			second: 'sn'
		}
	}}
>
	{#snippet children(args)}
		<div style="height: 350px">
			<TimePicker {...args} />
		</div>
	{/snippet}
</Story>

<Story
	name="Usage with onChange"
	args={{}}
>
	{#snippet children(args)}
		<div style="height: 350px">
			<TimePicker
				{...args}
				onChange={(time) => console.log('Time changed:', time)}
			/>
		</div>
	{/snippet}
</Story>