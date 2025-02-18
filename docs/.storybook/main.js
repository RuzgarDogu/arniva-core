import { fileURLToPath } from 'url';

/** @type { import('@storybook/sveltekit').StorybookConfig } */
const config = {
  "framework": {
    name: "@storybook/sveltekit",
    options: {}
  },
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx|svelte)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-svelte-csf"
  ],
  "viteFinal": async (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@ui': fileURLToPath(new URL('../../packages/ui/src/lib', import.meta.url))
    };
    return config;
  }
};

export default config;


// import { join, dirname } from "path"

// /**
// * This function is used to resolve the absolute path of a package.
// * It is needed in projects that use Yarn PnP or are set up within a monorepo.
// */
// function getAbsolutePath(value) {
//   return dirname(require.resolve(join(value, 'package.json')))
// }

// /** @type { import('@storybook/sveltekit').StorybookConfig } */
// const config = {
//   "stories": [
//     "../src/**/*.mdx",
//     "../src/**/*.stories.@(js|ts|svelte)"
//   ],
//   "addons": [
//     getAbsolutePath('@storybook/addon-svelte-csf'),
//     getAbsolutePath('@storybook/addon-essentials'),
//     getAbsolutePath('@chromatic-com/storybook'),
//     getAbsolutePath('@storybook/addon-interactions')
//   ],
//   "framework": {
//     "name": getAbsolutePath('@storybook/sveltekit'),
//     "options": {}
//   }
// };
// export default config;