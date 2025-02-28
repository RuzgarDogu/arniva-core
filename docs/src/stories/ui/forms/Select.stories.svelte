<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Select, InputGroup } from '@ui/forms';
	import { Dropdown, Button, DropdownContent } from '@ui/general';

	// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
	const { Story } = defineMeta({
		title: 'UI/Forms/Select',
		component: Select,
		tags: ['autodocs'],
		argTypes: {
			class: { control: 'text' },
			size: {
				control: 'select',
				options: ['small', 'medium', 'large']
			},
			disabled: { control: 'boolean' },
			rest: { control: 'object' }
		}
	});

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
		},
		{
			id: 8,
			name: 'Fiona Gallagher',
			email: 'fiona@dummy.com',
			phone: '6677889900',
			age: 33
		},
		{
			id: 9,
			name: 'George King',
			email: 'george@dummy.com',
			phone: '7788990011',
			age: 29
		},
		{
			id: 10,
			name: 'Hannah Montana',
			email: 'hannah@dummy.com',
			phone: '8899001122',
			age: 24
		}
	];
</script>

<Story name="Select Example" args={{ size: 'medium', placeholder: 'Select an option' }}>
	{#snippet children(args)}
		<Select {...args}>
			<option value="1">Test 1</option>
			<option value="2">Test 2</option>
			<option value="3">Test 3</option>
		</Select>
	{/snippet}
</Story>

<Story
    name="Select Example (Searchable)"
    args={{
        size: 'medium',
        placeholder: 'Start typing...',
        search: true,
        data: dummyData,
        /**
         * @param {Object} e - The selected item data
         */
		 onSelect: (e) => {
			if (e) {
				alert(JSON.stringify(e));
			} else {
				alert("Search is cleared");
			}
		}
    }}
>
    {#snippet children(args)}
        <Select {...args} />
    {/snippet}
</Story>

<Story name="Inside Input Group" args={{ size: 'medium', placeholder: 'Select an option' }}>
	{#snippet children(args)}
		<InputGroup icon style="margin-bottom: 30px;">
			<Select {...args}>
				<option value="1">Test 1</option>
				<option value="2">Test 2</option>
				<option value="3">Test 3</option>
			</Select>
			<Dropdown>
				<Button dropdown size="small" square color="transparent">
					<svg
						width="18px"
						height="18px"
						viewBox="0 0 32 32"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
							id="SVGRepo_tracerCarrier"
							stroke-linecap="round"
							stroke-linejoin="round"
						></g><g id="SVGRepo_iconCarrier">
							<path
								stroke="currentColor"
								stroke-linejoin="round"
								stroke-width="2"
								d="M13.905 3.379A.5.5 0 0114.39 3h3.22a.5.5 0 01.485.379l.689 2.757a.515.515 0 00.341.362c.383.126.755.274 1.115.443a.515.515 0 00.449-.003l2.767-1.383a.5.5 0 01.577.093l2.319 2.319a.5.5 0 01.093.577l-1.383 2.767a.515.515 0 00-.003.449c.127.271.243.549.346.833.053.148.17.265.319.315l2.934.978a.5.5 0 01.342.474v3.28a.5.5 0 01-.342.474l-2.934.978a.515.515 0 00-.32.315 9.937 9.937 0 01-.345.833.515.515 0 00.003.449l1.383 2.767a.5.5 0 01-.093.577l-2.319 2.319a.5.5 0 01-.577.093l-2.767-1.383a.515.515 0 00-.449-.003c-.271.127-.549.243-.833.346a.515.515 0 00-.315.319l-.978 2.934a.5.5 0 01-.474.342h-3.28a.5.5 0 01-.474-.342l-.978-2.934a.515.515 0 00-.315-.32 9.95 9.95 0 01-1.101-.475.515.515 0 00-.498.014l-2.437 1.463a.5.5 0 01-.611-.075l-2.277-2.277a.5.5 0 01-.075-.61l1.463-2.438a.515.515 0 00.014-.498 9.938 9.938 0 01-.573-1.383.515.515 0 00-.362-.341l-2.757-.69A.5.5 0 013 17.61v-3.22a.5.5 0 01.379-.485l2.757-.689a.515.515 0 00.362-.341c.157-.478.35-.94.573-1.383a.515.515 0 00-.014-.498L5.594 8.557a.5.5 0 01.075-.611l2.277-2.277a.5.5 0 01.61-.075l2.438 1.463c.152.091.34.094.498.014a9.938 9.938 0 011.382-.573.515.515 0 00.342-.362l.69-2.757z"
							></path>
							<circle
								cx="16"
								cy="16"
								r="5"
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
							></circle>
						</g></svg
					>
				</Button>
				<DropdownContent>
					<Button list color="transparent" label="Option A" />
					<Button list color="transparent" label="Option B" />
					<Button list color="transparent" label="Option C" />
				</DropdownContent>
			</Dropdown>
		</InputGroup>
	{/snippet}
</Story>

<Story name="Small Select Example" args={{ size: 'small' }}>
	{#snippet children(args)}
		<Select {...args}>
			<option value="1">Test 1</option>
			<option value="2">Test 2</option>
			<option value="3">Test 3</option>
		</Select>
	{/snippet}
</Story>

<Story name="Large Select Example" args={{ size: 'large' }}>
	{#snippet children(args)}
		<Select {...args}>
			<option value="1">Test 1</option>
			<option value="2">Test 2</option>
			<option value="3">Test 3</option>
		</Select>
	{/snippet}
</Story>

<Story name="Disabled Select Example" args={{ size: 'medium', disabled: true }}>
	{#snippet children(args)}
		<Select {...args}>
			<option value="1">Test 1</option>
			<option value="2">Test 2</option>
			<option value="3">Test 3</option>
		</Select>
	{/snippet}
</Story>
