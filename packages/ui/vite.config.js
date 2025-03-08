import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import fs from 'fs';

export default defineConfig({
    // Single plugins array with both plugins
    plugins: [
        sveltekit(),
        {
            name: 'vite-plugin-raw-svg',
            transform(code, id) {
                if (id.endsWith('.svg?raw')) {
                    const filePath = id.slice(0, -4); // remove '?raw'
                    const svg = fs.readFileSync(filePath, 'utf-8');
                    return `export default ${JSON.stringify(svg)};`;
                }
            }
        }
    ],
    // Add this configuration to handle raw SVG imports
    assetsInclude: ['**/*.svg'],
    build: {
        rollupOptions: {
            // Ensure assets like SVGs are properly handled
            input: undefined
        }
    },
    optimizeDeps: {
        include: [],
        exclude: []
    }
});