<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Table, Tbody, Trow } from '@ui/table';

	/**
    This is the ```Table Row``` component
    */

	const { Story } = defineMeta({
		title: 'UI/Table/Trow',
		component: Trow,
		tags: ['autodocs'],
		argTypes: {
			class: {
				control: {
					type: 'text'
				}
			}
		}
	});
</script>

<Story
	name="Default Table Row"
	args={{
		class: ''
	}}
>
	{#snippet children(args)}
		<Table>
			<Tbody>
				<Trow {...args}>
					<td>1</td>
					<td>John Doe</td>
					<td>johndoe@dummy.com</td>
					<td>+90 (555) 555-55-55</td>
					<td>42</td>
				</Trow>
			</Tbody>
		</Table>
	{/snippet}
</Story>
