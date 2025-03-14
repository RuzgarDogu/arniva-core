<script>
	// @ts-nocheck

	import { onMount } from 'svelte';
	import { Api } from '$lib/usageExample';
	import { toast } from '@ruzgardogu/utils';

	let bankData = $state([]);
	let isLoading = $state(false);
	async function getBankData() {
		try {
			const arnivaTest = await Api.get('https://test-api.arniva.cloud/v1/banka', {

				config: {
					dataKey: 'data',
					onAfter: (response) => {
						if (response.length) {
							toast.success(`Data fetched successfully with ${response.length} items`);
							bankData = response;
						}
					},
					onLoading: (loading) => {
						isLoading = loading;
					}
				}
			});
			console.log('arnivaTest', arnivaTest);
			// eslint-disable-next-line no-unused-vars
		} catch (error) {
			// console.error('******error', error);
		}
	}

	async function getSingleBankData(id) {
		try {
			const arnivaTest = await Api.get(`/banka/${id}`, {
				headers: {
					'Content-Type': 'text/plain',
				},
				config: {
					baseUrl: 'https://test-api.arniva.cloud/v1',
					dataKey: 'data',
					onAfter: (response) => {
						if (response) {
							console.log('Single Bank Data:', response);
						}
					}
				}
			});
			console.log('arnivaTest', arnivaTest);

			// const nativeFetch = await fetch(`https://test-api.arniva.cloud/v1/banka/${id}`);
			// const nativeFetchjson = await nativeFetch.json();
			// console.log("nativeFetchjson:", nativeFetchjson);

			// eslint-disable-next-line no-unused-vars
		} catch (error) {
			// console.error('******error', error);
		}
	}

	onMount(async () => {
		// try {
		// 	const defaultFetch = await fetch('https://test-api.arniva.cloud/v1/banka');
		// 	console.log("defaultFetch:", defaultFetch);
		// 	const defaultFetchjson = await defaultFetch.json();
		// 	console.log("defaultFetchjson:", defaultFetchjson);
		// } catch (error) {
		// 	console.error('******error', error);
		// }

		// Api.get('https://test-api.arniva.cloud/v1/banka')
		// 	.then((response) => {
		// 		console.log('123-response', response);
		// 	})
		// 	.catch((error) => {
		// 		console.error('error', error);
		// 	});

		try {
		    const test500 = await Api.get('/500', {
		        config: {
		            dataKey: 'testing2',
		            baseUrl: 'https://httpstat.us',
					suppressErrors: false
		        }
		    })
		    console.log("test500", test500);
		} catch (error) {
		    // console.error('******error', error);
		}
		// Alternatif url: http://test.arniva.org/v1/banka
		// try {
		// 	const arnivaTest = await Api.get('https://test-api.arniva.cloud/v1/banka', {
		// 		config: {
		// 			dataKey: 'data',
		// 			onAfter: (response) => {
		// 				if(response.length) {
		// 					toast.success(`Data fetched successfully with ${response.length} items`);
		// 				}
		// 			},
		// 		}
		// 	});
		// 	console.log('arnivaTest', arnivaTest);
		// } catch (error) {
		// 	// console.error('******error', error);
		// }
		// const test = await Api.get('/comments?postId=1', {
		// 	config: {
		// 		dataKey: ''
		// 	}
		// });
		// console.log('test', test);
		// await fetch("https://test-api.arniva.cloud/v1/banka/invalid-uuid")
		// .then(response => {
		// 	console.log("response", response);
		// 	if (response.ok) {
		// 		console.log("response", response.json());
		// 		return response.json();
		// 	}
		// })
		// .catch(error => console.log("_____Error:", error.message));





		const test3 = await Api.get(
			'forecast',
			{
				latitude: 51.5074,
				longitude: -0.1278,
				current_weather: true
			},
			{
				config: {
					baseUrl: 'https://api.open-meteo.com/v1'
				}
			}
		);
		console.log('test3', test3);




		
		// const test4 = await Api.get(
		// 	'forecast',
		// 	{
		// 		latitude: 51.5074,
		// 		longitude: -0.1278,
		// 		current_weather: true
		// 	},
		// 	{
		// 		config: {
		// 			baseUrl: 'https://api.open-meteo.com/v1'
		// 		}
		// 	}
		// );
		// console.log('test4', test4);
		// const test5 = await Api.get(
		// 	'https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current_weather=true'
		// );
		// console.log('test5', test5);
		// Example usage with named results
		const { comments, forecast } = await Api.all({
			comments: Api.get('/comments?postId=1', {
				config: {
					dataKey: ''
				}
			}),
			forecast: Api.get(
				'forecast',
				{
					config: {
						baseUrl: 'https://api.open-meteo.com/v1'
					}
				},
				{
					latitude: 51.5074,
					longitude: -0.1278,
					current_weather: true
				}
			)
		});
		// Access results using the property names
		console.log("comments", comments);  // comments data
		console.log("forecast", forecast);  // forecast data




// Execute multiple requests in parallel
Api.all({
  users: Api.get('/users'),
  posts: Api.get('/posts'),
  comments: Api.get('/comments')
})
  .then(results => {
    console.log('Users:', results.users);
    console.log('Posts:', results.posts);
    console.log('Comments:', results.comments);
  });


	});
</script>

<p>
	<button onclick={getBankData}>
		{#if isLoading}
			Loading...
		{:else}
			Get Bank Data
		{/if}
	</button>
</p>
<p>
	<button onclick={() => getSingleBankData('9301b223-10fa-4910-bc5a-870771ab68a9---emre')}>
		Get Single Bank Data
	</button>
</p>

{#if bankData.length}
	<ul>
		{#each bankData as item (item.id)}
			<li>{item.adi}</li>
		{/each}
	</ul>
{/if}

<!-- https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current_weather=true -->

<style>
	* {
		font-family: Arial, sans-serif;
	}
	button {
		padding: 10px 20px;
		background: #03a9f4;
		border: none;
		color: #fff;
		border-radius: 5px;
		width: 200px;
		cursor: pointer;
	}
	ul {
		list-style: none;
	}
	li {
		padding: 10px;
		border-bottom: 1px solid #ccc;
	}
</style>
