<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { Table, Thead, Trow } from '@ui/table';

    const { Story } = defineMeta({
      title: 'UI/Table/Thead',
      component: Thead,
      tags: ['autodocs'],
      argTypes: {
        class: {
          control: {
            type: 'text'
          }
        },
      }
    });
  </script>
  
  <Story name="Default Table Head" args={{
    flush: false,
  }}>
        {#snippet children(args)}
    <Table>
      <Thead {...args}>
        <Trow>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Age</th>
        </Trow>
    </Thead>
        </Table>
        {/snippet}
  </Story>

<Story name="Flush Table Head" args={{
    flush: true,
  }}>
        {#snippet children(args)}
    <Table>
      <Thead {...args}>
        <Trow>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Age</th>
        </Trow>
    </Thead>
        </Table>
        {/snippet}
  </Story>
