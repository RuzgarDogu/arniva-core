/** @type {import('@sveltejs/kit').Config} */

import adapter from '@sveltejs/adapter-auto';
import { sveltePreprocess } from 'svelte-preprocess'
import { dirname } from 'path'
import { fileURLToPath } from 'url'

const filePath = dirname(fileURLToPath(import.meta.url))
const sassPath = `${filePath}/src/lib/styles/`

const config = {
	kit: {
		// adapter-auto only supports some environments, see https://svelte.dev/docs/kit/adapter-auto for a list.
		// If your environment is not supported, or you settled on a specific environment, switch out the adapter.
		// See https://svelte.dev/docs/kit/adapters for more information about adapters.
		adapter: adapter()
	},
	preprocess: sveltePreprocess({
		scss: {
			prependData: `@import '${sassPath}app.scss';`
		}
	}),
};

export default config;
