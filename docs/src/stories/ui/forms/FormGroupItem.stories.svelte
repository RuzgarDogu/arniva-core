<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { FormGroup, FormGroupItem, Input } from '@ui/forms';
  
    // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
    const { Story } = defineMeta({
      title: 'UI/Forms/FormGroupItem',
      component: FormGroupItem,
      tags: ['autodocs'],
      argTypes: {
        label: { control: 'text' },
        required: { control: 'boolean' },
      },
      parameters: {
      docs: {
        description: {
          component: 'This component is used for grouping label and form elements inside a table element.',
          story: `
### Usage Notes
- In order to use this component properly, you must wrap \`FormGroupItem\` inside a \`FormGroup\` component.
- The \`FormGroupItem\` component is used to group form elements together.

### Alerts
> ⚠️ Ensure that the \`FormGroup\` component wraps both \`FormGroup\` and \`Other Elements\` for proper layout behavior.

### Example Code
\`\`\`html
    <FormGroup>
        <FormGroupItem label='name', required>
            <Input placeholder="Fill in your name" type="text" />
        </FormGroupItem>
    </FormGroup>
\`\`\`
      `
        },
      },
    },
    });
  </script>
  
  <Story name="Default" args={{ label: 'name', required: true }}>
    {#snippet children(args)}
    <FormGroup>
      <FormGroupItem {...args}>
        <Input placeholder="Fill in your name" type="text" />
      </FormGroupItem>
    </FormGroup>
    {/snippet}
</Story>
