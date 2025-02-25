<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Hello } from '@ui/general';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'UI/General/Hello',
		component: Hello,
		tags: ['autodocs'],
		argTypes: {
			name: { control: 'text' }
		},
		args: {}
	});
</script>

<Story name="Example" args={{ name: 'Emre' }} />
