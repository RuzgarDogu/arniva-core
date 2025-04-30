<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { FormGroup, FormGroupItem, FormGroupColumn, Input, Select } from '@ui/forms';

	// Define metadata for the FormGroup component
	const { Story } = defineMeta({
		title: 'UI/Forms/FormGroup',
		component: FormGroup,
		tags: ['autodocs'],
		parameters: {
			docs: {
				description: {
					component:
						'FormGroup is a component for grouping form elements together. It provides a consistent layout for form elements with support for different label positions and multi-column layouts.',
					story: `
### Usage Notes
- Use \`FormGroup\` as a container for your form elements.
- Use \`FormGroupItem\` for each individual form field with a label.
- For multiple columns with left labels, wrap related items in \`FormGroupColumn\` components.
- Set \`labelPosition\` to "left" or "top" to control label placement.
- Specify \`columns\` (1-5) to create multi-column layouts.

### Label Position Options
- \`left\`: Labels appear to the left of inputs (table layout ensures perfect alignment).
- \`top\`: Labels appear above inputs (uses flex layout).
`
				}
			}
		}
	});
</script>

<Story name="Labels on Top" args={{
	labelPosition: 'top',
	noBorder: false,
	columns: 1,
}}>
	{#snippet children(args)}
	<FormGroup {...args}>
		<FormGroupItem label="Name" required>
			<Input placeholder="Fill in your name" type="text" />
		</FormGroupItem>
		<FormGroupItem label="Email address" required>
			<Input type="email" />
		</FormGroupItem>
		<FormGroupItem label="Password" required>
			<Input type="password" />
		</FormGroupItem>
		<FormGroupItem label="Country">
			<Select>
				<option value="1">USA</option>
				<option value="2">Canada</option>
				<option value="3">Mexico</option>
			</Select>
		</FormGroupItem>
	</FormGroup>
	{/snippet}
</Story>

<Story name="Labels on Left" args={{
	labelPosition: 'left',
	noBorder: false,
	columns: 1,
}}>
	{#snippet children(args)}
	<FormGroup {...args}>
		<FormGroupItem label="Name" required>
			<Input placeholder="Fill in your name" type="text" />
		</FormGroupItem>
		<FormGroupItem label="Email address" required>
			<Input type="email" />
		</FormGroupItem>
		<FormGroupItem label="Password" required>
			<Input type="password" />
		</FormGroupItem>
		<FormGroupItem label="Country">
			<Select>
				<option value="1">USA</option>
				<option value="2">Canada</option>
				<option value="3">Mexico</option>
			</Select>
		</FormGroupItem>
	</FormGroup>
	{/snippet}
</Story>

<Story name="Two Columns (Left Labels)" args={{
	labelPosition: 'left',
	noBorder: false,
	columns: 2,
}}>
	{#snippet children(args)}
	<FormGroup {...args}>
		<FormGroupColumn>
			<FormGroupItem label="Name" required>
				<Input placeholder="Fill in your name" type="text" />
			</FormGroupItem>
			<FormGroupItem label="Password" required>
				<Input type="password" />
			</FormGroupItem>
		</FormGroupColumn>
		<FormGroupColumn>
			<FormGroupItem label="Email address" required>
				<Input type="email" />
			</FormGroupItem>
			<FormGroupItem label="Country">
				<Select>
					<option value="1">USA</option>
					<option value="2">Canada</option>
					<option value="3">Mexico</option>
				</Select>
			</FormGroupItem>
		</FormGroupColumn>
	</FormGroup>
	{/snippet}
</Story>
