<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Button } from '@ui/general';
	import { fn } from '@storybook/test';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'UI/General/Button',
		component: Button,
		tags: ['autodocs'],
		argTypes: {
			backgroundColor: { control: 'color' },
			size: {
				control: { type: 'select' },
				options: ['small', 'medium', 'large']
			},
			color: {
				control: { type: 'select' },
				options: ['primary', 'secondary', 'transparent']
			},
			type: {
				control: { type: 'select' },
				options: ['button', 'submit', 'reset']
			}
		},
		args: {
			onClick: fn()
		}
	});
</script>

<Story name="Primary" args={{ color: 'primary', label: 'Button' }} />

<Story name="Secondary" args={{ color: 'secondary', label: 'Button' }} />

<Story name="Large" args={{ size: 'large', label: 'Button' }} />

<Story name="Small" args={{ size: 'small', label: 'Button' }} />
