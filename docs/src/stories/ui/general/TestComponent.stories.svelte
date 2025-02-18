<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { TestComponent } from '@ui/general';
  
    // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
    const { Story } = defineMeta({
      title: 'UI/General/TestComponent',
      component: TestComponent,
      tags: ['autodocs'],
      argTypes: {
        value: { control: 'number' },
      },
      args: {}
    });
  </script>
  
  <Story name="Example" args={
    { value: 3 }
  } />
  