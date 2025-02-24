<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { FormGroup, FormGroupItem, Input, Select } from '@ui/forms';
  
    // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
    const { Story } = defineMeta({
      title: 'UI/Forms/FormGroup',
      component: FormGroup,
      tags: ['autodocs'],
      parameters: {
      docs: {
        description: {
          component: 'This component is used for grouping form elements together. It is a wrapper that provides a consistent layout for form elements.',
          story: `
### Usage Notes
- In order to use this component properly, you must wrap \`FormGroupItem\` inside a \`FormGroup\` component.
- The \`FormGroupItem\` component is used to group form elements together.

### Alerts
> ⚠️ Ensure that the \`FormGroup\` component wraps both \`FormGroup\` and \`Other Elements\` for proper layout behavior.

### Example Code
\`\`\`html
    <FormGroup>
        <FormGroupItem label="name" required>
            <Input placeholder="Fill in your name" type="text" />
        </FormGroupItem>
        <FormGroupItem label="email" required>
            <Input type="email" />
        </FormGroupItem>
        <FormGroupItem label="password" required>
            <Input type="password" />
        </FormGroupItem>
        <FormGroupItem label="select">
            <Select>
                <option value="1">Test 1</option>
                <option value="2">Test 2</option>
                <option value="3">Test 3</option>
            </Select>
        </FormGroupItem>
    </FormGroup>
\`\`\`
      `
        },
      },
    },
    });
  </script>
  
  <Story name="Example">
    <FormGroup style="margin-bottom: 30px;">
        <FormGroupItem label="name" required>
            <Input placeholder="Fill in your name" type="text" />
        </FormGroupItem>
        <FormGroupItem label="email" required>
            <Input type="email" />
        </FormGroupItem>
        <FormGroupItem label="password" required>
            <Input type="password" />
        </FormGroupItem>
        <FormGroupItem label="select">
            <Select>
                <option value="1">Test 1</option>
                <option value="2">Test 2</option>
                <option value="3">Test 3</option>
            </Select>
        </FormGroupItem>
    </FormGroup>
  </Story>
  