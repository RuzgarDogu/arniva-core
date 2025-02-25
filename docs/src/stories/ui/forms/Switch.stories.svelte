<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Switch } from '@ui/forms';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'UI/Forms/Switch',
		component: Switch,
		tags: ['autodocs'],
		argTypes: {
			trueText: { control: 'text' },
			falseText: { control: 'text' },
			value: { control: 'boolean' },
			disabled: { control: 'boolean' },
			name: { control: 'text' },
			id: { control: 'text' },
			label: { control: 'text' },
			required: { control: 'boolean' },
			color: {
				control: 'select',
				options: ['default', 'primary', 'secondary', 'accent', 'warning', 'danger', 'succes']
			},
			reverse: { control: 'boolean' },
			rest: { control: 'object' }
		}
	});
</script>

<Story
	name="Default Select Example"
	args={{
		trueText: 'Yes',
		falseText: 'No',
		value: false,
		disabled: false,
		name: 'switch',
		id: 'switch',
		label: 'Switch',
		required: false,
		color: 'default',
		reverse: false
	}}
/>

<Story
	name="Primary Select Example"
	args={{
		trueText: 'Yes',
		falseText: 'No',
		value: true,
		disabled: false,
		name: 'switch',
		id: 'switch',
		label: 'Switch',
		required: false,
		color: 'primary',
		reverse: false
	}}
/>

<Story
	name="Accent Select Example"
	args={{
		trueText: 'Yes',
		falseText: 'No',
		value: true,
		disabled: true,
		name: 'switch',
		id: 'switch',
		label: 'Switch',
		required: false,
		color: 'accent',
		reverse: false
	}}
/>

<Story
	name="Success Select Example"
	args={{
		trueText: 'Yes',
		falseText: 'No',
		value: true,
		disabled: true,
		name: 'switch',
		id: 'switch',
		label: 'Switch',
		required: false,
		color: 'success',
		reverse: false
	}}
/>

<Story
	name="Danger Select Example"
	args={{
		trueText: 'Yes',
		falseText: 'No',
		value: true,
		disabled: true,
		name: 'switch',
		id: 'switch',
		label: 'Switch',
		required: false,
		color: 'danger',
		reverse: false
	}}
/>
