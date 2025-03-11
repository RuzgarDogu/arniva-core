<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { AdvancedFilter, applyFilters } from '@ui/forms';
	import { Table, Tbody, Thead, Trow } from '@ui/table';

	/**
	 * @typedef {import('@ui/forms/filter/types').Filters} Filters
	 */

	const { Story } = defineMeta({
		title: 'UI/Forms/AdvancedFilter',
		component: AdvancedFilter
	});

	/** @type {Employee[]} */
	let dummyData = [
		{
			id: 1,
			name: 'John Doe',
			email: 'john@dummy.com',
			phone: '1234567890',
			age: 25,
			dob: '1999-04-15',
			gender: 'male',
			isManager: false,
			department: 'Sales'
		},
		{
			id: 2,
			name: 'Jane Doe',
			email: 'jane@dummy.com',
			phone: '0987654321',
			age: 30,
			dob: '1994-07-22',
			gender: 'female',
			isManager: true,
			department: 'Accounting'
		},
		{
			id: 3,
			name: 'Alice Smith',
			email: 'alice@dummy.com',
			phone: '1122334455',
			age: 28,
			dob: '1996-01-10',
			gender: 'female',
			isManager: false,
			department: 'Production'
		},
		{
			id: 4,
			name: 'Bob Johnson',
			email: 'bob@dummy.com',
			phone: '2233445566',
			age: 35,
			dob: '1989-11-05',
			gender: 'male',
			isManager: true,
			department: 'Sales'
		},
		{
			id: 5,
			name: 'Charlie Brown',
			email: 'charlie@dummy.com',
			phone: '3344556677',
			age: 40,
			dob: '1984-03-18',
			gender: 'male',
			isManager: true,
			department: 'Accounting'
		},
		{
			id: 6,
			name: 'Diana Prince',
			email: 'diana@dummy.com',
			phone: '4455667788',
			age: 22,
			dob: '2002-06-30',
			gender: 'female',
			isManager: false,
			department: 'Production'
		},
		{
			id: 7,
			name: 'Evan Wright',
			email: 'evan@dummy.com',
			phone: '5566778899',
			age: 27,
			dob: '1997-09-12',
			gender: 'male',
			isManager: false,
			department: 'Sales'
		},
		{
			id: 8,
			name: 'Fiona Gallagher',
			email: 'fiona@dummy.com',
			phone: '6677889900',
			age: 33,
			dob: '1991-12-08',
			gender: 'female',
			isManager: true,
			department: 'Accounting'
		},
		{
			id: 9,
			name: 'George King',
			email: 'george@dummy.com',
			phone: '7788990011',
			age: 29,
			dob: '1995-05-25',
			gender: 'male',
			isManager: false,
			department: 'Production'
		},
		{
			id: 10,
			name: 'Hannah Montana',
			email: 'hannah@dummy.com',
			phone: '8899001122',
			age: 24,
			dob: '2000-08-14',
			gender: 'female',
			isManager: false,
			department: 'Sales'
		}
	];

	let filterConfig = {
		name: 'filterName',
		search: {
			placeholder: 'Search Employees',
			columns: ['name', 'email', 'phone']
		},
		fields: [
			{
				name: 'age',
				label: 'Age',
				text: 'Select Age range',
				type: 'range',
				range: {
					min: dummyData.reduce((min, row) => Math.min(min, row.age), Infinity),
					max: dummyData.reduce((max, row) => Math.max(max, row.age), -Infinity)
				}
			},
			{
				name: 'dob',
				label: 'Date of Birth',
				text: 'Select date range',
				type: 'date',
				isAmerican: false,
				dateRange: true
			},
			{
				name: 'gender',
				label: 'Gender',
				text: 'Select Gender',
				type: 'select',
				options: [
					{
						label: 'Male Employees',
						value: 'male'
					},
					{
						label: 'Female Employees',
						value: 'female'
					}
				]
			},
			{
				name: 'department',
				label: 'Department',
				text: 'Select Department',
				type: 'multiselect',
				options: [
					{
						label: 'Production Employees',
						value: 'Production'
					},
					{
						label: 'Sales Employees',
						value: 'Sales'
					},
					{
						label: 'Accounting Employees',
						value: 'Accounting'
					}
				]
			},
			{
				name: 'isManager',
				label: 'Is Manager',
				text: 'Is this person a manager?',
				type: 'boolean',
				options: [
					{
						label: 'Yes',
						value: true
					},
					{
						label: 'No',
						value: false
					}
				]
			}
		]
	};

	/**
	 * @typedef {Object} Employee
	 * @property {number} id - Employee ID
	 * @property {string} name - Employee name
	 * @property {string} email - Employee email
	 * @property {string} phone - Employee phone
	 * @property {number} age - Employee age
	 * @property {string} dob - Employee date of birth
	 * @property {string} gender - Employee gender
	 * @property {boolean} isManager - Whether employee is a manager
	 * @property {string} department - Employee department
	 */

	/** @type {Employee[]} */
	let tableData = $state(dummyData);

	/**
	 * Handles filter changes and updates the table data
	 * @param {Filters} fields - The updated filter fields
	 */
	function handleChange(fields) {
		tableData = /** @type {Employee[]} */ (applyFilters(dummyData, fields, filterConfig));
	}
</script>

<Story name="Advanced Filter Default" exportName="Default" args={{}}>
	{#snippet children()}
		<div style="margin-bottom: 30px">
			<AdvancedFilter {filterConfig} onChange={handleChange} />
		</div>
		<Table>
			<Thead>
				<Trow>
					<th>ID</th>
					<th>Name</th>
					<th>Age</th>
					<th>Email</th>
					<th>Phone</th>
					<th>Gender</th>
					<th>Departmen</th>
					<th>Date of Birth</th>
					<th>Is Manager?</th>
				</Trow>
			</Thead>
			<Tbody>
				{#each tableData as row}
					<Trow>
						<td>{row.id}</td>
						<td>{row.name}</td>
						<td>{row.age}</td>
						<td>{row.email}</td>
						<td>{row.phone}</td>
						<td>{row.gender}</td>
						<td>{row.department}</td>
						<td>{row.dob}</td>
						<td>{row.isManager}</td>
					</Trow>
				{/each}
			</Tbody>
		</Table>
	{/snippet}
</Story>
