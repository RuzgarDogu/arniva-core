import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path';

export default {
  plugins: [sveltekit()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import 'src/lib/styles/app.scss';`
      }
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/lib/index.js')
      },
      output: {
        assetFileNames: 'styles/[name][extname]'
      }
    }
  }
};