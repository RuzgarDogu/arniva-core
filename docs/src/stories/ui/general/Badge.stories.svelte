<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { Badge } from '@ui/general';
  
    // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
    const { Story } = defineMeta({
      title: 'UI/General/Badge',
      component: Badge,
      tags: ['autodocs'],
      argTypes: {
        size: {
          control: {
            type: 'select',
            options: ['small', 'medium', 'large']
          }
        },
        rounded: {
          control: {
            type: 'boolean'
          }
        },
        title: { control: 'text' },
        color: {
          control: {
            type: 'select',
            options: ['primary', 'secondary', 'default', 'accent', 'success', 'danger', 'warning']
          }
        },
      }
    });
  </script>
  
  <Story name="Default Badge" args={{ title:'Default', color:'default' }}>
      {#snippet children(args)}
    <p>This is a
        <Badge {...args}>
            Default
        </Badge>
        badge example
    </p>
    {/snippet}
  </Story>

  <Story name="Success Badge" args={{ title:'Success', color:'success' }}>
      {#snippet children(args)}
    <p>This is a
        <Badge {...args}>
            Success
        </Badge>
        badge example
    </p>
    {/snippet}
  </Story>

  <Story name="Accent Badge" args={{ title:'Accent', color:'accent' }}>
      {#snippet children(args)}
    <p>This is a
        <Badge {...args}>
            Accent
        </Badge>
        badge example
    </p>
    {/snippet}
  </Story>

  <Story name="Rounded Accent Badge" args={{ title:'Accent', color:'accent', rounded:true }}>
      {#snippet children(args)}
    <p>This is a
        <Badge {...args}>
            Rounded
        </Badge>
        badge example
    </p>
    {/snippet}
  </Story>

  <Story name="Large Badge" args={{ title:'Accent', color:'accent', rounded:true, size:'large' }}>
      {#snippet children(args)}
    <p>This is a
        <Badge {...args}>
            Large
        </Badge>
        badge example
    </p>
    {/snippet}
  </Story>