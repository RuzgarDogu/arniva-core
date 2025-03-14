/** @type {import('./$types').PageServerLoad} */
import { Api } from '$lib/usageExample';

export async function load() {
    const test = await Api.get('/comments?postId=1');
    console.log("Test:", test);
    return {};
};