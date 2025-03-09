<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Icon } from '@ui/icons';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'UI/Icons/Icon',
		component: Icon
	});
</script>

<Story name="Default Icon" exportName="Default" args={{
    icon: 'mdi:home',
    inline: false,
    width: '24px',
    height: '24px',
    hFlip: false,
    vFlip: false,
    flip: '',
    rotate: 0,
    color: ''
}} />

<Story name="Colored Icon" exportName="ColoredIcon" args={{
    icon: 'mdi:home',
    inline: false,
    width: '48',
    height: '48',
    hFlip: false,
    vFlip: false,
    flip: '',
    rotate: 0,
    color: 'blue'
}} />
