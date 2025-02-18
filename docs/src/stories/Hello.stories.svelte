<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { Hello } from '$lib';
  
    // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
    const { Story } = defineMeta({
      title: 'Components/Welcome/Hello',
      component: Hello,
      tags: ['autodocs'],
      argTypes: {
        name: { control: 'text' },
      },
      args: {}
    });
  </script>
  
  <!-- More on writing stories with args: https://storybook.js.org/docs/writing-stories/args -->
  <Story name="Example" args={
    { name: 'Emre' }
  } />
  