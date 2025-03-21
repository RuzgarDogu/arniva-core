/** @type {import('./$types').PageLoad} */
import { Api } from '$lib/usageExample';
export async function load() {
	// const test = await fetch('https://jsonplaceholder.typicode.com/comments?postId=1');
	// const test = await fetch('https://test-api.arniva.cloud/v1/banka');
	// console.log("Test:", test);
	// const json = await test.json();
	// console.log("))))))))))))))))JSON:", json);


	try {
		const test = await Api.get('https://test-api.arniva.cloud/v1/banka');
		console.log("Test:", test);
	} catch (error) {
		console.error("/////-> Error:", error);
	}

	// return {
	//     data: json
	// };
	return {};
}
