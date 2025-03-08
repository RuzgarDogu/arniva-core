<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Radio } from '@ui/forms';

  /**
   * @typedef {Object} Props
   * @property {string} [class]
   * @property {string} [label]
   * @property {string} [style]
   * @property {string} [id]
   * @property {string} [name]
   * @property {string} [value]
   * @property {boolean} [checked] - Whether the Radio is checked
   * @property {boolean} [boxed] - Whether to display as a box instead of standard Radio
	 * @property {'primary' | 'secondary' | 'default' | 'accent' | 'success' | 'danger' | 'warning'} [color]
   * @property {string} [subtitle] - Additional descriptive text shown below the label
   * @property {(event: Event) => void} [onchange] - Function to call when the Radio value changes
   */

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'UI/Forms/Radio',
		component: Radio,
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
	name="Default Radio"
    exportName="Default"
	args={{
        label: 'This is a Radio',
    }}
/>
<Story
	name="Default Radio (Multiple)"
    exportName="DefaultMultiple"
>
{#snippet children()}
    <div style="margin-bottom: 10px">
        <Radio name="defaultMultiple" label="Option 1"/>
    </div>
    <div style="margin-bottom: 10px">
        <Radio name="defaultMultiple" label="Option 2"/>
    </div>
    <div style="margin-bottom: 10px">
        <Radio name="defaultMultiple" label="Option 3"/>
    </div>
{/snippet}
</Story>
<Story
	name="Boxed Radio (Multiple)"
    exportName="BoxedDefault"
>
{#snippet children()}
    <div style="margin-bottom: 10px">
        <Radio name="defaultMultiple" label="Option 1" subtitle="Lorem ipsum dolor sit amet..." boxed/>
    </div>
    <div style="margin-bottom: 10px">
        <Radio name="defaultMultiple" label="Option 2" subtitle="Lorem ipsum dolor sit amet..." boxed/>
    </div>
    <div style="margin-bottom: 10px">
        <Radio name="defaultMultiple" label="Option 3" subtitle="Lorem ipsum dolor sit amet..." boxed/>
    </div>
{/snippet}
</Story>

<Story
	name="Boxed Radio (Primary)"
    exportName="BoxedPrimary"
>
{#snippet children()}
    <div style="margin-bottom: 10px">
        <Radio name="defaultMultiple" label="Option 1" subtitle="Lorem ipsum dolor sit amet..." color="primary" boxed checked/>
    </div>
    <div style="margin-bottom: 10px">
        <Radio name="defaultMultiple" label="Option 2" subtitle="Lorem ipsum dolor sit amet..." color="primary" boxed/>
    </div>
    <div style="margin-bottom: 10px">
        <Radio name="defaultMultiple" label="Option 3" subtitle="Lorem ipsum dolor sit amet..." color="primary" boxed/>
    </div>
{/snippet}
</Story>

<Story
    name="Boxed Radio (Secondary)"
    exportName="BoxedSecondary"
    args={{
        label: 'Secondary Radio',
        subtitle: 'This is a subtitle for the secondary Radio',
        boxed: true,
        color: 'secondary',
        checked: true
    }}
/>

<Story
    name="Boxed Radio (Accent)"
    exportName="BoxedAccent"
    args={{
        label: 'Accent Radio',
        subtitle: 'This is a subtitle for the accent Radio',
        boxed: true,
        color: 'accent',
        checked: true
    }}
/>
<Story
    name="Boxed Radio (Success)"
    exportName="BoxedSuccess"
    args={{
        label: 'Success Radio',
        subtitle: 'This is a subtitle for the success Radio',
        boxed: true,
        color: 'success',
        checked: true
    }}
/>
<Story
    name="Boxed Radio (Danger)"
    exportName="BoxedDanger"
    args={{
        label: 'Danger Radio',
        subtitle: 'This is a subtitle for the danger Radio',
        boxed: true,
        color: 'danger',
        checked: true
    }}
/>
<Story
    name="Boxed Radio (Warning)"
    exportName="BoxedWarning"
    args={{
        label: 'Warning Radio',
        subtitle: 'This is a subtitle for the warning Radio',
        boxed: true,
        color: 'warning',
        checked: true
    }}
/>