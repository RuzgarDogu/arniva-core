/** @type {import('./$types').PageLoad} */

let dummyData = [
	{
		id: 1,
		firstName: 'John',
		lastName: 'Doe',
		email: 'john.doe@example.com',
		phone: '+1-555-0123',
		age: 28,
		department: 'Engineering',
		position: 'Senior Developer',
		salary: 85000,
		startDate: '2022-03-15',
		isActive: true,
		city: 'New York',
		country: 'USA',
		skills: 'JavaScript, React, Node.js',
		experience: 5,
		education: 'Bachelor of Science',
		manager: 'Alice Johnson',
		projectCount: 12,
		lastLogin: '2024-01-15 14:30:00',
		performanceRating: 4.5
	},
	{
		id: 2,
		firstName: 'Jane',
		lastName: 'Smith',
		email: 'jane.smith@example.com',
		phone: '+1-555-0124',
		age: 32,
		department: 'Marketing',
		position: 'Marketing Manager',
		salary: 75000,
		startDate: '2021-07-20',
		isActive: true,
		city: 'Los Angeles',
		country: 'USA',
		skills: 'Digital Marketing, SEO, Analytics',
		experience: 8,
		education: 'Master of Business Administration',
		manager: 'Robert Wilson',
		projectCount: 18,
		lastLogin: '2024-01-16 09:15:00',
		performanceRating: 4.2
	},
	{
		id: 3,
		firstName: 'Michael',
		lastName: 'Johnson',
		email: 'michael.johnson@example.com',
		phone: '+1-555-0125',
		age: 35,
		department: 'Sales',
		position: 'Sales Director',
		salary: 95000,
		startDate: '2020-01-10',
		isActive: true,
		city: 'Chicago',
		country: 'USA',
		skills: 'Sales Strategy, CRM, Leadership',
		experience: 12,
		education: 'Bachelor of Business',
		manager: 'Sarah Davis',
		projectCount: 25,
		lastLogin: '2024-01-16 11:45:00',
		performanceRating: 4.8
	},
	{
		id: 4,
		firstName: 'Emily',
		lastName: 'Brown',
		email: 'emily.brown@example.com',
		phone: '+1-555-0126',
		age: 26,
		department: 'Design',
		position: 'UI/UX Designer',
		salary: 68000,
		startDate: '2023-02-28',
		isActive: true,
		city: 'San Francisco',
		country: 'USA',
		skills: 'Figma, Adobe Creative Suite, Prototyping',
		experience: 3,
		education: 'Bachelor of Fine Arts',
		manager: 'David Lee',
		projectCount: 8,
		lastLogin: '2024-01-15 16:20:00',
		performanceRating: 4.1
	},
	{
		id: 5,
		firstName: 'David',
		lastName: 'Wilson',
		email: 'david.wilson@example.com',
		phone: '+1-555-0127',
		age: 41,
		department: 'Operations',
		position: 'Operations Manager',
		salary: 82000,
		startDate: '2019-05-12',
		isActive: true,
		city: 'Houston',
		country: 'USA',
		skills: 'Process Optimization, Project Management, Lean Six Sigma',
		experience: 15,
		education: 'Master of Operations Management',
		manager: 'Lisa Anderson',
		projectCount: 22,
		lastLogin: '2024-01-16 08:30:00',
		performanceRating: 4.6
	},
	{
		id: 6,
		firstName: 'Sarah',
		lastName: 'Davis',
		email: 'sarah.davis@example.com',
		phone: '+1-555-0128',
		age: 38,
		department: 'Human Resources',
		position: 'HR Director',
		salary: 90000,
		startDate: '2018-09-03',
		isActive: true,
		city: 'Boston',
		country: 'USA',
		skills: 'Talent Acquisition, Employee Relations, Policy Development',
		experience: 14,
		education: 'Master of Human Resources',
		manager: 'CEO',
		projectCount: 30,
		lastLogin: '2024-01-16 10:00:00',
		performanceRating: 4.7
	},
	{
		id: 7,
		firstName: 'Robert',
		lastName: 'Miller',
		email: 'robert.miller@example.com',
		phone: '+1-555-0129',
		age: 29,
		department: 'Finance',
		position: 'Financial Analyst',
		salary: 72000,
		startDate: '2022-11-15',
		isActive: true,
		city: 'Atlanta',
		country: 'USA',
		skills: 'Financial Modeling, Excel, SQL, Python',
		experience: 4,
		education: 'Bachelor of Finance',
		manager: 'Jennifer Garcia',
		projectCount: 15,
		lastLogin: '2024-01-15 13:45:00',
		performanceRating: 4.3
	},
	{
		id: 8,
		firstName: 'Lisa',
		lastName: 'Anderson',
		email: 'lisa.anderson@example.com',
		phone: '+1-555-0130',
		age: 44,
		department: 'IT',
		position: 'IT Director',
		salary: 105000,
		startDate: '2017-04-22',
		isActive: true,
		city: 'Seattle',
		country: 'USA',
		skills: 'Infrastructure, Cloud Computing, Cybersecurity',
		experience: 18,
		education: 'Master of Information Technology',
		manager: 'CTO',
		projectCount: 35,
		lastLogin: '2024-01-16 07:15:00',
		performanceRating: 4.9
	},
	{
		id: 9,
		firstName: 'James',
		lastName: 'Taylor',
		email: 'james.taylor@example.com',
		phone: '+1-555-0131',
		age: 31,
		department: 'Engineering',
		position: 'DevOps Engineer',
		salary: 88000,
		startDate: '2021-12-01', 
		isActive: false,
		city: 'Denver',
		country: 'USA',
		skills: 'Docker, Kubernetes, AWS, CI/CD',
		experience: 7,
		education: 'Bachelor of Computer Science',
		manager: 'Alice Johnson',
		projectCount: 19,
		lastLogin: '2023-12-20 15:30:00',
		performanceRating: 4.4
	},
	{
		id: 10,
		firstName: 'Maria',
		lastName: 'Garcia',
		email: 'maria.garcia@example.com',
		phone: '+1-555-0132',
		age: 27,
		department: 'Customer Support',
		position: 'Support Specialist',
		salary: 45000,
		startDate: '2023-06-10',
		isActive: true,
		city: 'Miami',
		country: 'USA',
		skills: 'Customer Service, Technical Support, CRM Software',
		experience: 2,
		education: 'Associate Degree',
		manager: 'Kevin Martinez',
		projectCount: 6,
		lastLogin: '2024-01-16 12:00:00',
		performanceRating: 4.0
	}
];


export async function load() {
    return {
        dummyData
    };
};