<script module>
    import { defineMeta } from '@storybook/addon-svelte-csf';
    import { Table, Tbody, Thead, Trow } from '@ui/table';
  
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
    },
    {
        id: 6,
        name: 'Diana Prince',
        email: 'diana@dummy.com',
        phone: '4455667788',
        age: 22
    },
    {
        id: 7,
        name: 'Evan Wright',
        email: 'evan@dummy.com',
        phone: '5566778899',
        age: 27
    }
];

    // More on how to set up stories at: https://storybook.js.org/docs/writing-stories
    const { Story } = defineMeta({
      title: 'UI/Table/Table',
      component: Table,
      tags: ['autodocs'],
      argTypes: {
        size: {
          control: { type: 'select' },
          options: ['normal', 'large', 'compact'],
        },
        type: {
          control: { type: 'select' },
          options: ['default', 'stripe'],
        },
        headerType: {
          control: { type: 'select' },
          options: ['normal', 'sticky', 'static'],
        },
        border: {
          control: { type: 'select' },
          options: ['inline', 'full', 'none'],
        },
        height: {
          control: { type: 'text' },
        },
      }
    });
  </script>
  
  <Story name="Default Table" args={{}}>
    {#snippet children(args)}
      <Table {...args}>
        <Thead>
            <Trow>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Age</th>
            </Trow>
        </Thead>
        <Tbody>
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

  <Story name="Stripe Table" args={{
    type: 'stripe'
  }}>
    {#snippet children(args)}
      <Table {...args}>
        <Thead>
            <Trow>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Age</th>
            </Trow>
        </Thead>
        <Tbody>
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

  <Story name="Flush Header" args={{}}>
    {#snippet children(args)}
      <Table {...args}>
        <Thead flush>
            <Trow>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Age</th>
            </Trow>
        </Thead>
        <Tbody>
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


  <Story name="Static Header" args={{
    headerType: 'static',
    height: '200px'
  }}>
    {#snippet children(args)}
      <Table {...args}>
        <Thead flush>
            <Trow>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Age</th>
            </Trow>
        </Thead>
        <Tbody>
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

