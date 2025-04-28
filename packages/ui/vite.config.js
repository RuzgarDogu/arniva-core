import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';

export default defineConfig(({ mode }) => {
	// Now you can use mode to determine if it's dev or production
	const isDev = mode === 'development';
	console.log('========dev', isDev);

	let alias = isDev
		? {
				'@ruzgardogu/utils': fileURLToPath(new URL('../utils/src/lib', import.meta.url))
			}
		: {};

	return {
		plugins: [sveltekit()],
		resolve: {
			alias: alias
		}
	};
});