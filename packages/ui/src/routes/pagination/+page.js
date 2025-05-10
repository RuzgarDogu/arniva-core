let filterConfig = {
    name: 'filterName',
    translation:{
        general: {
            filter: "Filtrele",
            clear: "Temizle",
            delete: "Sil",
        }
    },
    search: {
        placeholder: 'Search Comments',
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
                label: 'Search in Body',
                value: 'body'
            }
        ]
    },
    fields: [
        {
            name: 'postId',
            label: 'Post ID',
            text: 'Select post range',
            type: 'range',
            range: {
                min: 1,
                max: 100
            }
        }
    ]
};

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, url }) {
    console.log("url", url.searchParams.get('start'));

    const start = url.searchParams.get('start') || 0;
    const limit = url.searchParams.get('limit') || 10;

    const RES = await fetch(`https://jsonplaceholder.typicode.com/comments?_start=${start}&_limit=${limit}`);
	let comments = [];
	if (RES.ok) {
		comments = await RES.json();
	}

    let currentPagination = {
        totalItems: 500,
        start: parseInt(start),
        limit: parseInt(limit)
    }

    return {
        comments,
        filterConfig,
        currentPagination,
    };
};