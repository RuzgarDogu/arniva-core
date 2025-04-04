<script>
	/** @type {{ data: import('./$types').PageData }} */
	import {
		Button,
		Switch,
		Table,
		Thead,
		Tbody,
		Trow,
		InputGroup,
		Dropdown,
		DropdownContent,
		Accordion,
		AccordionItem,
		Input,
		Tab,
		TabItem,
		Badge,
		Alert,
		ListGroup,
		ListGroupItem,
		FormGroup,
		FormGroupItem,
		Select,
		Card,
		CardHeader,
		CardFooter,
		CardBody,
		Modal,
		DatePicker,
		Checkbox,
		Radio,
		Range
	} from '$lib';
	let switchValue = false;

	import { clickOutside } from '$lib/functions';

	function handleSwitchChange(value) {
		let result = value ? 'ON' : 'OFF';
		// alert(`Switch value changed to: ${result}`);
	}

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

	let modal3;

	// For single date selection:
	let singleDate = null;

	// For date range selection:
	let dateRange = { start: null, end: null };

	let testid = 8;

	let switchvalue = true;

</script>

<h1 style="margin-bottom: 20px;">ANA SAYFA: Introduction</h1>

<h2>{switchvalue}</h2>

<div style="margin-bottom: 20px;">
	<Switch 
  trueText="Yes"
  falseText="No"
  bind:value={switchvalue}
  disabled={false}
  name="switch"
  id="switch"
  label="Switch"
  required={false}
  color="default"
  reverse={false}
 />
</div>

<Button onClick={() => modal3.show()} color="primary" style="margin-bottom: 20px;">
	Open Modal 3
</Button>

<Select 
size="medium"
placeholder="Start typing..."
search
data={dummyData}
onSelect={(e) => console.log('e', e)}
/>

<Modal id="testModal3" title="Test Modal3" size="lg" name="Test_Modal3" bind:this={modal3}>

	<FormGroup>
		<FormGroupItem label="Adı" required>
			<Select size="medium" placeholder="Select an option" bind:value={testid}>
				{#each dummyData as branch (branch.id)}
					<option value={branch.id}>{branch.name}</option>
				{/each}
			</Select>
			<Select 
			size="medium"
			placeholder="Start typing..."
			search
			data={dummyData}
			bind:value={testid}
			/>
		</FormGroupItem>
	</FormGroup>

</Modal>

<!-- <button data-ar-toggle="modal" data-ar-target="testModal" class="input-group-text bg-lightgray border-0 border-end-0 p-1">
	Modal 1
	</button> -->
<div style="margin-bottom: 20px;">
	<Range
		color="primary"
		min={0}
		max={100}
		type="range"
		onChange={(value) => console.log('Single Range:', value)}
	/>
</div>
<div style="margin-bottom: 20px;">
	<Checkbox label="Check me" color="default" subtitle="Lorem impsum dolor sit amet" />
</div>
<div style="margin-bottom: 20px;">
	<Radio name="asd" label="Check me" color="primary" subtitle="Lorem impsum dolor sit amet" />
	<Radio name="asd" label="Check me 2" color="primary" subtitle="Lorem impsum dolor sit amet" />
	<Radio name="asd" label="Check me 3" color="primary" subtitle="Lorem impsum dolor sit amet" />
</div>
<div style="margin-bottom: 20px;">
	<Checkbox label="Check me" color="default" subtitle="Lorem impsum dolor sit amet" boxed />
</div>
<div style="margin-bottom: 20px;">
	<Checkbox label="Check me" color="primary" subtitle="Lorem impsum dolor sit amet" boxed />
</div>
<div style="margin-bottom: 20px;">
	<Checkbox label="Check me" color="danger" subtitle="Lorem impsum dolor sit amet" boxed />
</div>
<div style="margin-bottom: 20px;">
	<Checkbox label="Check me" color="success" subtitle="Lorem impsum dolor sit amet" boxed />
</div>
<div style="margin-bottom: 20px;">
	<Checkbox label="Check me" color="warning" subtitle="Lorem impsum dolor sit amet" boxed />
</div>
<div style="margin-bottom: 20px;">
	<Checkbox label="Check me" color="accent" subtitle="Lorem impsum dolor sit amet" boxed />
</div>

<div style="margin-bottom: 20px;">
	<Radio name="asd" label="Check me" color="primary" subtitle="Lorem impsum dolor sit amet" boxed />
	<Radio
		name="asd"
		label="Check me 2"
		color="primary"
		subtitle="Lorem impsum dolor sit amet"
		boxed
	/>
	<Radio
		name="asd"
		label="Check me 3"
		color="primary"
		subtitle="Lorem impsum dolor sit amet"
		boxed
	/>
</div>
<!-- <div style="margin-bottom: 20px;">
	<Button onClick={() => toast.show("deneme", { duration: 3000, position: 'top-right'})}>Toast Test</Button>
	<Button color="success" onClick={() => toast.success('This is success toast', { duration: 3000, title:"This is title" })}>Toast - Title</Button>
	<Button color="danger" onClick={() => toast.danger('This is danger toast with bounce', { duration: 3000, transition:'bounce' })}>Danger - Bounce</Button>
	<Button color="warning" onClick={() => toast.warning('This is warning toast with fade', { duration: 3000, transition: 'fade' })}>Warning - Fade</Button>
	<Button color="primary" onClick={() => toast.info('Hello info toast with no progress bar', { duration: 3000, transition: 'asd', showProgressBar:false })}>Info - No Progress Bar</Button>

</div> -->
<div style="margin-bottom: 20px;">
	<DatePicker isRange={false} quickSelect manualInput bind:selectedDate={singleDate} />
</div>
<div style="margin-bottom: 20px;">
	<!-- Date range picker -->
	<DatePicker isRange={true} quickSelect manualInput bind:dateRange />
</div>

<div style="margin-bottom: 20px;">
	<Select
		search
		data={dummyData}
		onSelect={(e) => console.log('e', e)}
		placeholder="Start typing..."
	/>
</div>
<div style="margin-bottom: 20px;">
	<Select placeholder="Select an option">
		<option value="1">Test 1</option>
		<option value="2">Test 2</option>
		<option value="3">Test 3</option>
	</Select>
</div>

<div>
	<InputGroup icon style="margin-bottom: 30px;">
		<Select search data={dummyData} onSelect={(e) => console.log('e', e)} />
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
</div>

<div>
	<InputGroup icon style="margin-bottom: 30px;">
		<Select>
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
				<Button list label="Option A" />
				<Button list label="Option B" />
				<Button list label="Option C" />
			</DropdownContent>
		</Dropdown>
	</InputGroup>
</div>

<Button modal="testModal" color="primary" style="margin-bottom: 20px;">Modal 1</Button>



<Modal
	id="testModal"
	devMode
	title="Test Modal"
	size="lg"
	name="Test_Modal"
	onclose={() => console.log('Modal Closed')}
>
	<p>
		Lorem ipsum dolor sit amet consectetur adipisicing elit. Asperiores sequi atque officiis earum
		nemo, consectetur reprehenderit illo sit provident nisi tempora voluptatem obcaecati hic
		voluptatum reiciendis a. Veritatis dignissimos, voluptas deserunt eaque nulla vitae? Error,
		repellat! Atque obcaecati, dolorum quis autem voluptatem totam dolorem magni cumque ad, quam
		laboriosam illo!
	</p>
	<Button modal="testModal2" color="danger" style="margin-bottom: 20px;">Modal 2</Button>
	<Button modal="testModal2" color="primary" style="margin-bottom: 20px;">Modal 2</Button>
	<Button modal="testModal2" color="warning" style="margin-bottom: 20px;">Modal 2</Button>
	<Button modal="testModal2" color="accent" style="margin-bottom: 20px;">Modal 2</Button>
	<Button modal="testModal2" color="secondary" style="margin-bottom: 20px;">Modal 2</Button>
	<Button modal="testModal2" color="success" style="margin-bottom: 20px;">Modal 2</Button>
	<Button modal="testModal2" color="default" style="margin-bottom: 20px;">Modal 2</Button>
</Modal>

<Modal id="testModal2" title="Test Modal2" size="lg" name="Test_Modal2">
	<h1>ok3</h1>
	<Button modal="testModal3" color="danger" style="margin-bottom: 20px;">Modal 3</Button>
</Modal>



<Input placeholder="Fill in your name" type="text" style="margin-bottom: 30px;" />

<div style="margin-bottom: 40px; margin-top:40px;">
	<Card>
		<CardHeader title="Card Title" />
		<CardBody>
			<p>
				Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minus, veritatis iusto cumque
				sapiente porro ad animi itaque, impedit voluptates numquam sunt autem fugit corporis laborum
				vero eaque, quo temporibus dolores sequi commodi hic accusamus ducimus perferendis? Unde
				minima repellat voluptates vitae. Tempora quasi minima est, perspiciatis dicta sit nihil
				quaerat.
			</p>
			<p><a style="color:blue; text-decoration: none;" href="#">Have Questions?</a></p>
		</CardBody>
		<CardFooter border>
			<div style="display: flex; justify-content: space-between;">
				<div>
					<Button label="Submit" color="primary" size="small" />
					<Button label="Cancel" color="secondary" size="small" />
				</div>
				<Button label="Learn More" size="small" />
			</div>
		</CardFooter>
	</Card>
</div>

<div style="margin-bottom: 40px; margin-top:40px;">
	<Table headerType="static" height="200px">
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
					<td>{item.name}-{item.name}-{item.name}</td>
					<td>{item.email}</td>
					<td>{item.phone}</td>
					<td>{item.age}</td>
				</Trow>
			{/each}
		</Tbody>
	</Table>
</div>

<div style="margin-bottom: 40px; margin-top:40px;">
	<Table headerType="sticky" type="stripe">
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
</div>

<div style="margin-bottom: 40px; margin-top:40px;">
	<Table headerType="normal">
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
</div>

<div style="margin-bottom: 20px;">
	<Button label="Button" color="primary" />
</div>

<div style="margin-bottom: 20px;">
	<Switch
		reverse
		trueText="Yes"
		falseText="No"
		label="Toggle Setting"
		value={switchValue}
		onChange={handleSwitchChange}
		name="my-switch"
		required
	/>
</div>

<p>
	Welcome to <strong>ARNIVA-CORE</strong> – a collection of packages to streamline your Svelte
	development workflow that is
	<Badge title="Awesome" color="success" rounded />
</p>

<Alert color="success" title="Testing" style="margin-bottom: 20px;">
	Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda ipsa, est doloribus, quaerat
	temporibus modi eveniet at debitis a reprehenderit esse consequuntur saepe voluptatum pariatur
	iusto harum rem? Quis, consequuntur.
</Alert>
<Alert color="default" title="Testing" style="margin-bottom: 20px;">
	Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda ipsa, est doloribus, quaerat
	temporibus modi eveniet at debitis a reprehenderit esse consequuntur saepe voluptatum pariatur
	iusto harum rem? Quis, consequuntur.
</Alert>
<Alert color="warning" title="Testing" style="margin-bottom: 20px;">
	Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda ipsa, est doloribus, quaerat
	temporibus modi eveniet at debitis a reprehenderit esse consequuntur saepe voluptatum pariatur
	iusto harum rem? Quis, consequuntur.
</Alert>
<Alert color="accent" title="Testing" style="margin-bottom: 20px;">
	Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda ipsa, est doloribus, quaerat
	temporibus modi eveniet at debitis a reprehenderit esse consequuntur saepe voluptatum pariatur
	iusto harum rem? Quis, consequuntur.
</Alert>
<Alert color="primary" title="Testing" style="margin-bottom: 20px;">
	Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda ipsa, est doloribus, quaerat
	temporibus modi eveniet at debitis a reprehenderit esse consequuntur saepe voluptatum pariatur
	iusto harum rem? Quis, consequuntur.
</Alert>
<Alert color="danger" title="Testing" style="margin-bottom: 20px;">
	Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda ipsa, est doloribus, quaerat
	temporibus modi eveniet at debitis a reprehenderit esse consequuntur saepe voluptatum pariatur
	iusto harum rem? Quis, consequuntur.
</Alert>

<ListGroup>
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

<Accordion>
	<AccordionItem title="Accordion Item 1" list>
		<li>
			<a href="/">
				<svg
					width="16px"
					height="16px"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
						id="SVGRepo_tracerCarrier"
						stroke-linecap="round"
						stroke-linejoin="round"
					></g><g id="SVGRepo_iconCarrier">
						<path d="M2 3L22 3" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path>
						<path
							d="M7.5 7C6.56538 7 6.09808 7 5.75 7.20096C5.52197 7.33261 5.33261 7.52197 5.20096 7.75C5 8.09808 5 8.56538 5 9.5L5 18.5C5 19.4346 5 19.9019 5.20096 20.25C5.33261 20.478 5.52197 20.6674 5.75 20.799C6.09808 21 6.56538 21 7.5 21C8.43462 21 8.90192 21 9.25 20.799C9.47803 20.6674 9.66739 20.478 9.79904 20.25C10 19.9019 10 19.4346 10 18.5L10 9.5C10 8.56538 10 8.09808 9.79904 7.75C9.66739 7.52197 9.47803 7.33261 9.25 7.20096C8.90192 7 8.43462 7 7.5 7Z"
							stroke="#1C274C"
							stroke-width="1.5"
						></path>
						<path
							d="M16.5 7C15.5654 7 15.0981 7 14.75 7.20096C14.522 7.33261 14.3326 7.52197 14.201 7.75C14 8.09808 14 8.56538 14 9.5L14 15.5C14 16.4346 14 16.9019 14.201 17.25C14.3326 17.478 14.522 17.6674 14.75 17.799C15.0981 18 15.5654 18 16.5 18C17.4346 18 17.9019 18 18.25 17.799C18.478 17.6674 18.6674 17.478 18.799 17.25C19 16.9019 19 16.4346 19 15.5L19 9.5C19 8.56538 19 8.09808 18.799 7.75C18.6674 7.52197 18.478 7.33261 18.25 7.20096C17.9019 7 17.4346 7 16.5 7Z"
							stroke="#1C274C"
							stroke-width="1.5"
						></path>
					</g></svg
				>
				Menu Item 1
			</a>
		</li>
		<li>
			<a href="/">
				<svg
					width="16px"
					height="16px"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
						id="SVGRepo_tracerCarrier"
						stroke-linecap="round"
						stroke-linejoin="round"
					></g><g id="SVGRepo_iconCarrier">
						<path
							d="M16 4C18.175 4.01211 19.3529 4.10856 20.1213 4.87694C21 5.75562 21 7.16983 21 9.99826V15.9983C21 18.8267 21 20.2409 20.1213 21.1196C19.2426 21.9983 17.8284 21.9983 15 21.9983H9C6.17157 21.9983 4.75736 21.9983 3.87868 21.1196C3 20.2409 3 18.8267 3 15.9983V9.99826C3 7.16983 3 5.75562 3.87868 4.87694C4.64706 4.10856 5.82497 4.01211 8 4"
							stroke="#1C274C"
							stroke-width="1.5"
						></path>
						<path
							d="M9 13.4L10.7143 15L15 11"
							stroke="#1C274C"
							stroke-width="1.5"
							stroke-linecap="round"
							stroke-linejoin="round"
						></path>
						<path
							d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z"
							stroke="#1C274C"
							stroke-width="1.5"
						></path>
					</g></svg
				>
				Menu Item 2
			</a>
		</li>
	</AccordionItem>
	<AccordionItem title="Accordion Item 2" list>
		<li>
			<a href="/">
				<svg
					width="16px"
					height="16px"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
						id="SVGRepo_tracerCarrier"
						stroke-linecap="round"
						stroke-linejoin="round"
					></g><g id="SVGRepo_iconCarrier">
						<path
							d="M16 4.00195C18.175 4.01406 19.3529 4.11051 20.1213 4.87889C21 5.75757 21 7.17179 21 10.0002V16.0002C21 18.8286 21 20.2429 20.1213 21.1215C19.2426 22.0002 17.8284 22.0002 15 22.0002H9C6.17157 22.0002 4.75736 22.0002 3.87868 21.1215C3 20.2429 3 18.8286 3 16.0002V10.0002C3 7.17179 3 5.75757 3.87868 4.87889C4.64706 4.11051 5.82497 4.01406 8 4.00195"
							stroke="#1C274C"
							stroke-width="1.5"
						></path>
						<path d="M10.5 14L17 14" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"
						></path>
						<path d="M7 14H7.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path>
						<path d="M7 10.5H7.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path>
						<path d="M7 17.5H7.5" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"></path>
						<path d="M10.5 10.5H17" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"
						></path>
						<path d="M10.5 17.5H17" stroke="#1C274C" stroke-width="1.5" stroke-linecap="round"
						></path>
						<path
							d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z"
							stroke="#1C274C"
							stroke-width="1.5"
						></path>
					</g></svg
				>
				Menu Item 3
			</a>
		</li>
		<li>
			<a href="/">
				<svg
					width="16px"
					height="16px"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
						id="SVGRepo_tracerCarrier"
						stroke-linecap="round"
						stroke-linejoin="round"
					></g><g id="SVGRepo_iconCarrier">
						<path
							d="M2 6C2 3.79086 3.79086 2 6 2C8.20914 2 10 3.79086 10 6V18C10 20.2091 8.20914 22 6 22C3.79086 22 2 20.2091 2 18V6Z"
							stroke="#1C274C"
							stroke-width="1.5"
						></path>
						<path
							d="M9.99977 8.24268L13.3134 4.92902C14.8755 3.36692 17.4082 3.36692 18.9703 4.92902C20.5324 6.49112 20.5324 9.02378 18.9703 10.5859L9.30615 20.25"
							stroke="#1C274C"
							stroke-width="1.5"
						></path>
						<path
							d="M6 22L18 22C20.2091 22 22 20.2091 22 18C22 15.7909 20.2091 14 18 14L15.5 14"
							stroke="#1C274C"
							stroke-width="1.5"
						></path>
						<path
							d="M7 18C7 18.5523 6.55228 19 6 19C5.44772 19 5 18.5523 5 18C5 17.4477 5.44772 17 6 17C6.55228 17 7 17.4477 7 18Z"
							stroke="#1C274C"
							stroke-width="1.5"
						></path>
					</g></svg
				>
				Menu Item 4
			</a>
		</li>
	</AccordionItem>
</Accordion>

<p>
	Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis iusto pariatur eos
	repudiandae nemo maiores itaque porro, iste illum dicta? Perferendis recusandae asperiores commodi
	architecto sit consequuntur magnam, dolor illum laborum ullam sapiente quae non velit. Architecto
	id reiciendis recusandae fuga sequi sit voluptatem aspernatur provident ipsum aliquid, rerum
	repudiandae ad veniam dolorum facilis nemo iste possimus harum minus soluta? Fugiat at debitis
	adipisci asperiores laborum ea ipsa. Esse nostrum fugiat doloribus tenetur recusandae dolor atque
	soluta totam fugit sint est harum, neque molestias temporibus excepturi consequatur repellat
	dolores magni ipsam. Eius, facilis. Ad nam beatae dolorem molestias. Nam, magnam?
</p>

<Tab style="margin-bottom: 30px;">
	<TabItem title="Tab Item 1">
		<FormGroup style="margin-bottom: 30px;">
			<FormGroupItem label="name" required>
				<Input placeholder="Fill in your name" type="text" />
			</FormGroupItem>
			<FormGroupItem label="email" required>
				<Input type="email" />
			</FormGroupItem>
			<FormGroupItem label="password" required>
				<Input type="password" />
			</FormGroupItem>
			<FormGroupItem label="select">
				<Select>
					<option value="1">Test 1</option>
					<option value="2">Test 2</option>
					<option value="3">Test 3</option>
				</Select>
			</FormGroupItem>
		</FormGroup>
	</TabItem>
	<TabItem title="Tab Item 2">
		<p>Tab Item 2 Content</p>
	</TabItem>
	<TabItem title="Tab Item 3">
		<p>Tab Item 3 Content</p>
		<p>Tab Item 3 Content</p>
		<p>Tab Item 3 Content</p>
		<p>Tab Item 3 Content</p>
		<p>Tab Item 3 Content</p>
		<p>Tab Item 3 Content</p>
		<p>Tab Item 3 Content</p>
	</TabItem>
	{#snippet right()}
		<Dropdown>
			<Button color="secondary" square dropdown>
				<svg
					width="16px"
					height="16px"
					viewBox="0 0 24 24"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
						id="SVGRepo_tracurrentColorerCarrier"
						stroke-linecurrentcap="round"
						stroke-linejoin="round"
					></g><g id="SVGRepo_icurrentColoronCarrier">
						<path d="M4 18V6" stroke="currentColor" stroke-width="1.5" stroke-linecurrentcap="round"
						></path>
						<path
							d="M20 6V18"
							stroke="currentColor"
							stroke-width="1.5"
							stroke-linecurrentcap="round"
						></path>
						<path
							d="M12 10C16.4183 10 20 8.20914 20 6C20 3.79086 16.4183 2 12 2C7.58172 2 4 3.79086 4 6C4 8.20914 7.58172 10 12 10Z"
							stroke="currentColor"
							stroke-width="1.5"
						></path>
						<path
							d="M20 12C20 14.2091 16.4183 16 12 16C7.58172 16 4 14.2091 4 12"
							stroke="currentColor"
							stroke-width="1.5"
						></path>
						<path
							d="M20 18C20 20.2091 16.4183 22 12 22C7.58172 22 4 20.2091 4 18"
							stroke="currentColor"
							stroke-width="1.5"
						></path>
					</g></svg
				>
			</Button>
			<DropdownContent>
				<Button list label="Option 1" />
				<Button list label="Option 2" />
				<Button list label="Option 3" />
			</DropdownContent>
		</Dropdown>
	{/snippet}
</Tab>

<p>
	Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis iusto pariatur eos
	repudiandae nemo maiores itaque porro, iste illum dicta? Perferendis recusandae asperiores commodi
	architecto sit consequuntur magnam, dolor illum laborum ullam sapiente quae non velit. Architecto
	id reiciendis recusandae fuga sequi sit voluptatem aspernatur provident ipsum aliquid, rerum
	repudiandae ad veniam dolorum facilis nemo iste possimus harum minus soluta? Fugiat at debitis
	adipisci asperiores laborum ea ipsa. Esse nostrum fugiat doloribus tenetur recusandae dolor atque
	soluta totam fugit sint est harum, neque molestias temporibus excepturi consequatur repellat
	dolores magni ipsam. Eius, facilis. Ad nam beatae dolorem molestias. Nam, magnam?
</p>

<Dropdown>
	<Button dropdown>Dropdown Deneme</Button>
	<DropdownContent>
		<Button list label="Option 1" />
		<Button list label="Option 2" />
		<Button list label="Option 3" />
	</DropdownContent>
</Dropdown>
