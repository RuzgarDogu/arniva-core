<script>
	/** @type {{ data: import('./$types').PageData }} */
	let { data } = $props();
	import { AdvancedFilter, Table, Tbody, Thead, Trow, Range, applyFilters, Button, Icon, Checkbox } from '$lib';

	let filterConfig = {
		name: 'filterName',
		translation:{
			general: {
				filter: "Filtrele",
				clear: "Temizle",
				delete: "Sil",
			},
			date: {
				selectdate: "Tarih Seç",
				selectenddate: "Bitiş Tarihi Seç",
				thisweek: "Bu Hafta",
				lastweek: "Geçen Hafta",
				thismonth: "Bu Ay",
				lastmonth: "Geçen Ay",
				thisyear: "Bu Yıl",
				lastyear: "Geçen Yıl",
			}
		},
		search: {
			placeholder: 'Search Employees',
			columns: [
				{
					label: 'Search in Name',
					value: 'name'
				},
				{
					label: 'Search in Email',
					value: 'email'
				},
				{
					label: 'Search in Phone',
					value: 'phone'
				}
			]
		},
		fields: [
			{
				name: 'age',
				label: 'Age',
				text: 'Select Age range',
				type: 'range',
				range: {
					min: data.dummyData.reduce((min, row) => Math.min(min, row.age), Infinity),
					max: data.dummyData.reduce((max, row) => Math.max(max, row.age), -Infinity)
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

	let tableData = $state(data.dummyData);

	function handleChange(fields) {
		console.log("fields", fields);
		tableData = applyFilters(data.dummyData, fields, filterConfig);
	}

	/**
	 * Applies filters to a dataset based on filter configuration and current filter values
	 * @param {Array} data - The dataset to filter
	 * @param {Object} filters - The current filter values (e.g., {gender: 'male', department: ['sales', 'accounting']})
	 * @param {Object} config - The filter configuration object
	 * @returns {Array} - The filtered dataset
	 */

	// Use the new filtering function in your derived state
</script>

<!-- <div style="margin-bottom: 30px;">
    <Range onChange={handleRange} type="single" color="primary"/>
</div>
<div style="margin-bottom: 30px;">
    <Range onChange={handleRange} type="range" color="secondary"/>
</div>
<div style="margin-bottom: 30px;">
    <Range onChange={handleRange} type="range" color="success"/>
</div>
<div style="margin-bottom: 30px;">
    <Range onChange={handleRange} type="range" color="danger"/>
</div>
<div style="margin-bottom: 30px;">
    <Range onChange={handleRange} type="range" color="warning"/>
</div>
<div style="margin-bottom: 30px;">
    <Range onChange={handleRange} type="range" color="accent" min={20} max={300}/>
</div> -->
<h1>Filter</h1>
<div class="d-flex gap-3 mb-3">
	<AdvancedFilter {filterConfig} onChange={handleChange} />
	<Button autoWidth color="primary" onClick={() => tableData = data.dummyData}>Yeni Banka Ekle</Button>
</div>


<Table>
	<Thead>
		<Trow>
			<th>
				<Checkbox inline />
			</th>
			<th>ID</th>
			<th>Name</th>
			<th>Age</th>
			<th>Email</th>
			<th>Phone</th>
			<th>Gender</th>
			<th>Departmen</th>
			<th>Date of Birth</th>
			<th>Is Manager?</th>
			<th>Actions</th>
		</Trow>
	</Thead>
	<Tbody>
		{#each tableData as row, index (index)}
			<Trow onClick={() => console.log("row click", row)}>
				<td><Checkbox inline /></td>
				<td>{row.id}</td>
				<td>{row.name}</td>
				<td>{row.age}</td>
				<td>{row.email}</td>
				<td>{row.phone}</td>
				<td>{row.gender}</td>
				<td>{row.department}</td>
				<td>{row.dob}</td>
				<td>{row.isManager}</td>
				<td>
					<Button color="primary" size="small" onClick={() => console.log("button click", row)}>
						Edit
					</Button>
					<Button color="danger" size="small" onClick={() => console.log(row)}>Delete</Button>
					<Button color="success" size="small" onClick={() => console.log(row)}>View</Button>
				</td>
			</Trow>
		{/each}
	</Tbody>
</Table>

<style>
	.d-flex {
		display: flex;
	}
	.gap-3 {
		gap: 1rem;
	}

</style>