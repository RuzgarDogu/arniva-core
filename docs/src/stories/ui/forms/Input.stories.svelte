<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { Input } from '@ui/forms';
  
    // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
    const { Story } = defineMeta({
      title: 'UI/Forms/Input',
      component: Input,
      tags: ['autodocs'],
      argTypes: {
        class: { control: 'text' },
        placeholder: { control: 'text' },
        type: { 
            control: 'select',
            options: ['text', 'number', 'email', 'password', 'hidden']
        },
        size: {
            control: { type: 'select' },
            options: ['small', 'medium', 'large'],
        },
        disabled: { control: 'boolean' },
        rest: { control: 'object' },
      }
    });
  </script>
  
  <Story name="Input Text" args={{ placeholder: 'Fill in your name', type: 'text', size: 'medium' }}>
    {#snippet children(args)}
      <Input {...args}/>
    {/snippet}
  </Story>

  <Story name="Input Number" args={{ placeholder: 'Fill in your age', type: 'number', size: 'medium' }}>
    {#snippet children(args)}
      <Input {...args}/>
    {/snippet}
  </Story>

  <Story name="Input Password" args={{ placeholder: 'Fill in your password', type: 'password', size: 'medium' }}>
    {#snippet children(args)}
      <Input {...args}/>
    {/snippet}
  </Story>

  <Story name="Large Input" args={{ placeholder: 'Fill in your name', type: 'text', size: 'large' }}>
    {#snippet children(args)}
      <Input {...args}/>
    {/snippet}
  </Story>

  <Story name="Small Input" args={{ placeholder: 'Fill in your name', type: 'text', size: 'small' }}>
    {#snippet children(args)}
      <Input {...args}/>
    {/snippet}
  </Story>

  <Story name="Disabled Input" args={{ placeholder: 'This is a disabled input', type: 'text', size: 'medium', disabled: true }}>
    {#snippet children(args)}
      <Input {...args}/>
    {/snippet}
  </Story>