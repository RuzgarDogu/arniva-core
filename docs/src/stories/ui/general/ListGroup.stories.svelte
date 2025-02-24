<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { ListGroup, ListGroupItem } from '@ui/general';
  
    // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
    const { Story } = defineMeta({
      title: 'UI/General/ListGroup',
      component: ListGroup,
      tags: ['autodocs'],
    });
  </script>
  
  <Story name="Default List Group" args={{ title:'Default Alert', color:'default' }}>
    {#snippet children(args)}
    <ListGroup {...args}>
        <ListGroupItem>
            <p>List Item 1</p>
        </ListGroupItem>
        <ListGroupItem>
            <p>List Item 2</p>
        </ListGroupItem>
        <ListGroupItem>
            <p>List Item 3</p>
        </ListGroupItem>
    </ListGroup>

    {/snippet}
  </Story>