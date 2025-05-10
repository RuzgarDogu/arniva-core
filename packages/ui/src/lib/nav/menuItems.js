const menuitems = [
	{
		id: 100,
		groupid: 1,
		title: 'Menu 1',
		link: '#',
		icon: 'mdi:information-outline',
		active: false,
		submenu: [
			{
				title: 'Ajax Search',
				link: '/ajaxsearch',
				id: 101,
				active: false,
				icon: 'mdi:search'
			},
            {
                title: 'Deneme',
                link: '/deneme',
                id: 102,
                active: false,
                icon: 'mdi:home'
            },
            {
                title: 'Filter',
                link: '/filter',
                id: 103,
                active: false,
                icon: 'mdi:home'
            },
            {
                title: 'Filter New',
                link: '/filternew',
                id: 104,
                active: false,
                icon: 'mdi:home'
            },
            {
                title: 'Form Group',
                link: '/formgroup',
                id: 105,
                active: false,
                icon: 'mdi:home'
            },
            {
                title: 'Forms',
                link: '/forms',
                id: 106,
                active: false,
                icon: 'mdi:home'
            }
		]
	},
    {
        id: 200,
        groupid: 2,
        title: 'Menu 2',
        link: '#',
        icon: 'mdi:information-outline',
        active: false,
        submenu: [
            {
                title: 'Icons',
                link: '/icons',
                id: 201,
                active: false,
                icon: 'mdi:home'
            },
            {
                title: 'Input Test',
                link: '/inputtest',
                id: 202,
                active: false,
                icon: 'mdi:home'
            },
            {
                title: 'List Group',
                link: '/listgroup',
                id: 203,
                active: false,
                icon: 'mdi:home'
            },
            {
                title: 'Modal Test',
                link: '/modaltest',
                id: 204,
                active: false,
                icon: 'mdi:home'
            }
        ]
    },
    {
        id: 300,
        groupid: 3,
        title: 'Menu 3',
        link: '#',
        icon: 'mdi:information-outline',
        active: false,
        submenu:[
            {
                title:'Pagination',
                link:'/pagination',
                id:'301',
                active:false,
                icon:'mdi:pencil'
            },
            {
                title:'Radio Test',
                link:'/radiotest',
                id:'302',
                active:false,
                icon:'mdi:pencil'
            },
            {
                title:'Select Test',
                link:'/selecttest',
                id:'303',
                active:false,
                icon:'mdi:pencil'
            },
            {
                title:'Tab Test',
                link:'/tabtest',
                id:'304',
                active:false,
                icon:'mdi:pencil'
            }
        ]
    }
];

export default menuitems;