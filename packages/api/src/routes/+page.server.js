/** @type {import('./$types').PageServerLoad} */
import { Api } from '$lib/usageExample';

export async function load() {
    const test = await Api.get('/comments?postId=1');
    try {
		const test = await Api.get('https://test-api.arniva.cloud/v1/banka');
		console.log("Test:", test);
	} catch (error) {
		console.error("/////-> Error:", error);
	}
    console.log("Test:", test);
    return {};
};