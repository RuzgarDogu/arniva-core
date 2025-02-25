<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { Table, Tbody, Trow } from '@ui/table';
  
    let dummyData = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@dummy.com',
        phone: '1234567890',
        age: 25
    },
    {
        id: 2,
        name: 'Jane Doe',
        email: 'jane@dummy.com',
        phone: '0987654321',
        age: 30
    },
    {
        id: 3,
        name: 'Alice Smith',
        email: 'alice@dummy.com',
        phone: '1122334455',
        age: 28
    },
    {
        id: 4,
        name: 'Bob Johnson',
        email: 'bob@dummy.com',
        phone: '2233445566',
        age: 35
    },
    {
        id: 5,
        name: 'Charlie Brown',
        email: 'charlie@dummy.com',
        phone: '3344556677',
        age: 40
    }
];

    const { Story } = defineMeta({
      title: 'UI/Table/Tbody',
      component: Tbody,
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
  
  <Story name="Default Tabl Body" args={{
    class: '',
  }}>
        {#snippet children(args)}
    <Table>
            <Tbody {...args}>
                {#each dummyData as item}
                    <Trow>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.email}</td>
                        <td>{item.phone}</td>
                        <td>{item.age}</td>
                    </Trow>
                {/each}
            </Tbody>
        </Table>
        {/snippet}
  </Story>
