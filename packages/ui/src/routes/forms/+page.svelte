<script>
    /** @type {{ data: import('./$types').PageData }} */

    import { Button, Dropdown, DropdownContent, Input, InputGroup, DatePicker, Icon, Select } from '$lib';

    let { data } = $props();

    const onSelect = (item) => {
        console.log(item);
    };
</script>

<div class="flex-row">
    <Select size="medium" placeholder="Select an option">
        <option value="1">Test 1</option>
        <option value="2">Test 2</option>
        <option value="3">Test 3</option>
    </Select>


    <InputGroup>
        <Select 
        size="medium"
        placeholder="Start typing..."
        search
        data={[ {  "id": 1,  "name": "John Doe",  "email": "john@dummy.com",  "phone": "1234567890",  "age": 25 }, {  "id": 2,  "name": "Jane Doe",  "email": "jane@dummy.com",  "phone": "0987654321",  "age": 30 }, {  "id": 3,  "name": "Alice Smith",  "email": "alice@dummy.com",  "phone": "1122334455",  "age": 28 }, {  "id": 4,  "name": "Bob Johnson",  "email": "bob@dummy.com",  "phone": "2233445566",  "age": 35 }, {  "id": 5,  "name": "Charlie Brown",  "email": "charlie@dummy.com",  "phone": "3344556677",  "age": 40 }, {  "id": 6,  "name": "Diana Prince",  "email": "diana@dummy.com",  "phone": "4455667788",  "age": 22 }, {  "id": 7,  "name": "Evan Wright",  "email": "evan@dummy.com",  "phone": "5566778899",  "age": 27 }, {  "id": 8,  "name": "Fiona Gallagher",  "email": "fiona@dummy.com",  "phone": "6677889900",  "age": 33 }, {  "id": 9,  "name": "George King",  "email": "george@dummy.com",  "phone": "7788990011",  "age": 29 }, {  "id": 10,  "name": "Hannah Montana",  "email": "hannah@dummy.com",  "phone": "8899001122",  "age": 24 } ]}
        onSelect={onSelect}
       />
            <Button size="small" square color="light">
                <Icon icon="mdi:dots-horizontal" width="18" height="18" color="var(--ar-text-color-subtle)"/>
            </Button>
            <Button size="small" square color="light">
                <Icon icon="mdi:plus" width="18" height="18" color="var(--ar-text-color-subtle)"/>
            </Button>
    </InputGroup>



</div>

<div class="flex-row">
    <InputGroup>
        <Input type="text" placeholder="Arayın" />
            <Button dropdown size="small" square color="light">
                <Icon icon="mdi:dots-horizontal" width="18" height="18" color="var(--ar-text-color-subtle)"/>
            </Button>
            <Button dropdown size="small" square color="light">
                <Icon icon="mdi:plus" width="18" height="18" color="var(--ar-text-color-subtle)"/>
            </Button>
    </InputGroup>

    
    <Input 
    placeholder="Fill in your name"
    type="text"
    size="medium"
   />

</div>
<div class="flex-row">

<DatePicker  />
<Input 
placeholder="Fill in your name"
type="text"
size="medium"
/>

</div>

<style>
    .flex-row {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        margin-bottom: 30px;
    }
</style>