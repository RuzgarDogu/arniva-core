<script>
	import { onMount } from 'svelte';
	import { Api } from '$lib/usageExample';

	onMount(async () => {
        
        try {
            const test500 = await Api.get('/500', {
                config: {
                    dataKey: 'testing2',
                    baseUrl: 'https://httpstat.us'
                }
            })
            console.log("test500", test500);
        } catch (error) {
            console.error('******error', error);
        }

        
		const arnivaTest = await Api.get('https://test-api.arniva.cloud/v1/banka', {
            config: {
                dataKey: 'data'
            }
        });
		console.log('arnivaTest', arnivaTest);

		const test = await Api.get('/comments?postId=1', {
			config: {
				dataKey: 'testing'
			}
		});
		console.log('test', test);


		const test3 = await Api.get(
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
		);

		console.log('test3', test3);

		const test4 = await Api.get(
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

		console.log('test4', test4);

		const test5 = await Api.get(
			'https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current_weather=true'
		);
		console.log('test5', test5);
	});
</script>

<h1>Welcome to your library project</h1>
<p>Create your package using @sveltejs/package and preview/showcase your work with SvelteKit</p>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p>

https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current_weather=true
