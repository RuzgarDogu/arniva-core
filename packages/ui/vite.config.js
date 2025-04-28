import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { fileURLToPath, URL } from 'url';

export default defineConfig(({ mode }) => {
	// Now you can use mode to determine if it's dev or production
	const isDev = mode === 'development';
	console.log('========dev', isDev);

	// For development, use local file references
	// For production, rely on proper package dependencies
	// let alias = isDev
	// 	? {
	// 			'@ruzgardogu/utils': fileURLToPath(new URL('../utils/src/lib', import.meta.url))
	// 	  }
	// 	: {};

	return {
		plugins: [sveltekit()],
		// resolve: {
		// 	alias: alias
		// },
		// Ensure external packages are properly handled in build
		build: {
			rollupOptions: {
				// Mark @ruzgardogu/utils as external so it's not bundled
				external: ['@ruzgardogu/utils']
			}
		}
	};
});