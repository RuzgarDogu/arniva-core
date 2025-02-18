<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { TestComponent } from '@ui/general';
  
    // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
    const { Story } = defineMeta({
      title: 'UI/General',
      component: TestComponent,
      tags: ['autodocs'],
      argTypes: {
        value: { control: 'number' },
      },
      args: {}
    });
  </script>
  
  <!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
  <Story name="ASD" args={
    { value: 3 }
  } />
  