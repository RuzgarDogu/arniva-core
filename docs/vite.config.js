import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import { fileURLToPath, URL } from 'url';


/**
 * Vite configuration function
 * @param {Object} config - The configuration object
 * @param {string} config.mode - The environment mode ('development' | 'production')
 * @returns {import('vite').UserConfig}
 */

export default ({ mode }) => {
	// Extends 'process.env.*' with VITE_*-variables from '.env.(mode=production|development)'
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
	return defineConfig({
		plugins: [sveltekit()],
		resolve: {
			alias: {
				'@ui': fileURLToPath(new URL('../packages/ui/src/lib', import.meta.url)),
				'@utils': fileURLToPath(new URL('../packages/utils/src/lib', import.meta.url))
			}
		}
	});
};
