import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';
import { fileURLToPath, URL } from 'url';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter(),
		alias: {
			// Keep the alias for development mode
			'@ruzgardogu/utils': fileURLToPath(new URL('../utils/src/lib', import.meta.url))
		}
	},
	preprocess: preprocess({
		scss: {
			includePaths: ['src/lib/styles'] // Adjusted path
		}
	})
};

export default config;
