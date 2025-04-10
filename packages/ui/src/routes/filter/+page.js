/** @type {import('./$types').PageLoad} */
export async function load() {

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
		},
		{
			id: 10,
			name: 'Ğşü çöğü Iışık',
			email: 'hannah@dummy.com',
			phone: '8899001122',
			age: 24,
			dob: '2000-08-14',
			gender: 'female',
			isManager: false,
			department: 'Sales'
		}
	];

	return {
		dummyData
	};
}
