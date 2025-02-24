<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { Select } from '@ui/forms';
  
    // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
    const { Story } = defineMeta({
      title: 'UI/Forms/Select',
      component: Select,
      tags: ['autodocs'],
      argTypes: {
        class: { control: 'text' },
        size: { 
            control: 'select',
            options: ['small', 'medium', 'large'],
        },
        disabled: { control: 'boolean' },
        rest: { control: 'object' },
      }
    });
  </script>
  
  <Story name="Select Example" args={{ size:'medium' }}>
    {#snippet children(args)}
    <Select  {...args}>
        <option value="1">Test 1</option>
        <option value="2">Test 2</option>
        <option value="3">Test 3</option>
    </Select>
    {/snippet}
  </Story>

  <Story name="Small Select Example" args={{ size:'small' }}>
    {#snippet children(args)}
    <Select  {...args}>
        <option value="1">Test 1</option>
        <option value="2">Test 2</option>
        <option value="3">Test 3</option>
    </Select>
    {/snippet}
  </Story>

  <Story name="Large Select Example" args={{ size:'large' }}>
    {#snippet children(args)}
    <Select  {...args}>
        <option value="1">Test 1</option>
        <option value="2">Test 2</option>
        <option value="3">Test 3</option>
    </Select>
    {/snippet}
  </Story>

  <Story name="Disabled Select Example" args={{ size:'medium', disabled: true }}>
    {#snippet children(args)}
    <Select  {...args}>
        <option value="1">Test 1</option>
        <option value="2">Test 2</option>
        <option value="3">Test 3</option>
    </Select>
    {/snippet}
  </Story>