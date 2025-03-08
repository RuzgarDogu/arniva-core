<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Range } from '@ui/forms';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'UI/Forms/Range',
		component: Range,
		tags: ['autodocs'],
        argTypes: {
            type: { control: 'select', options: ['single', 'range'] },
            color: { control: 'select', options: ['primary', 'secondary', 'accent', 'warning', 'danger', 'success'] },
            min: { control: 'number' },
            max: { control: 'number' },
            onChange: { action: 'change' },
        }
	});
</script>
<Story
	name="Default Range"
	args={{
        type: 'range',
        color: 'primary',
        onChange: (value) => alert(JSON.stringify(value))
    }}
>
    {#snippet children(args)}
        <Range {...args} />
    {/snippet}
</Story>

<Story
	name="Single Range"
	args={{
        type: 'single',
        min: 55,
        max: 75,
        color: 'primary',
        onChange: (value) => alert(JSON.stringify(value))
    }}
>
    {#snippet children(args)}
        <Range {...args} />
    {/snippet}
</Story>

<Story
	name="Warning Range"
	args={{
        type: 'range',
        min: 0,
        max: 100,
        color: 'warning',
        onChange: (value) => alert(JSON.stringify(value))
    }}
>
    {#snippet children(args)}
        <Range {...args} />
    {/snippet}
</Story>

<Story
	name="Accent Range"
	args={{
        type: 'range',
        min: 0,
        max: 100,
        color: 'accent',
        onChange: (value) => alert(JSON.stringify(value))
    }}
>
    {#snippet children(args)}
        <Range {...args} />
    {/snippet}
</Story>

<Story
	name="Success Range"
	args={{
        type: 'range',
        min: 0,
        max: 100,
        color: 'success',
        onChange: (value) => alert(JSON.stringify(value))
    }}
>
    {#snippet children(args)}
        <Range {...args} />
    {/snippet}
</Story>