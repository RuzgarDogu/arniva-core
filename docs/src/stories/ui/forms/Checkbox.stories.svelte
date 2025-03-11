<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Checkbox } from '@ui/forms';

	/**
	 * @typedef {Object} Props
	 * @property {string} [class]
	 * @property {string} [label]
	 * @property {string} [style]
	 * @property {string} [id]
	 * @property {string} [name]
	 * @property {string} [value]
	 * @property {boolean} [checked] - Whether the checkbox is checked
	 * @property {boolean} [boxed] - Whether to display as a box instead of standard checkbox
	 * @property {'primary' | 'secondary' | 'default' | 'accent' | 'success' | 'danger' | 'warning'} [color]
	 * @property {string} [subtitle] - Additional descriptive text shown below the label
	 * @property {(event: Event) => void} [onchange] - Function to call when the checkbox value changes
	 */

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'UI/Forms/Checkbox',
		component: Checkbox,
		argTypes: {
			color: {
				control: {
					type: 'select',
					options: ['primary', 'secondary', 'default', 'accent', 'success', 'danger', 'warning']
				}
			},
			checked: {
				control: {
					type: 'boolean'
				}
			},
			boxed: {
				control: {
					type: 'boolean'
				}
			},
			onchange: {
				action: 'onchange'
			},
			label: {
				control: {
					type: 'text'
				}
			},
			subtitle: {
				control: {
					type: 'text'
				}
			},
			value: {
				control: {
					type: 'text'
				}
			},
			name: {
				control: {
					type: 'text'
				}
			},
			id: {
				control: {
					type: 'text'
				}
			},
			style: {
				control: {
					type: 'text'
				}
			},
			class: {
				control: {
					type: 'text'
				}
			}
		}
	});
</script>

<Story
	name="Default Checkbox"
	exportName="Default"
	args={{
		label: 'This is a checkbox'
	}}
/>
<Story
	name="Boxed Checkbox (Default)"
	exportName="BoxedDefault"
	args={{
		label: 'Boxed Checkbox',
		subtitle: 'This is a subtitle for the boxed checkbox',
		boxed: true
	}}
/>

<Story
	name="Boxed Checkbox (Primary)"
	exportName="BoxedPrimary"
	args={{
		label: 'Primary Checkbox',
		subtitle: 'This is a subtitle for the primary checkbox',
		boxed: true,
		color: 'primary',
		checked: true
	}}
/>

<Story
	name="Boxed Checkbox (Secondary)"
	exportName="BoxedSecondary"
	args={{
		label: 'Secondary Checkbox',
		subtitle: 'This is a subtitle for the secondary checkbox',
		boxed: true,
		color: 'secondary',
		checked: true
	}}
/>

<Story
	name="Boxed Checkbox (Accent)"
	exportName="BoxedAccent"
	args={{
		label: 'Accent Checkbox',
		subtitle: 'This is a subtitle for the accent checkbox',
		boxed: true,
		color: 'accent',
		checked: true
	}}
/>
<Story
	name="Boxed Checkbox (Success)"
	exportName="BoxedSuccess"
	args={{
		label: 'Success Checkbox',
		subtitle: 'This is a subtitle for the success checkbox',
		boxed: true,
		color: 'success',
		checked: true
	}}
/>
<Story
	name="Boxed Checkbox (Danger)"
	exportName="BoxedDanger"
	args={{
		label: 'Danger Checkbox',
		subtitle: 'This is a subtitle for the danger checkbox',
		boxed: true,
		color: 'danger',
		checked: true
	}}
/>
<Story
	name="Boxed Checkbox (Warning)"
	exportName="BoxedWarning"
	args={{
		label: 'Warning Checkbox',
		subtitle: 'This is a subtitle for the warning checkbox',
		boxed: true,
		color: 'warning',
		checked: true
	}}
/>
