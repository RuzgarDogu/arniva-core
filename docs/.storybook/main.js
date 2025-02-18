import { fileURLToPath } from 'url';

/** @type { import('@storybook/sveltekit').StorybookConfig } */
const config = {
  "framework": {
    name: "@storybook/sveltekit",
    options: {
      storySort: {
        order: ['Welcome', 'UI', 'Utils']
      }
    }
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
      '@ui': fileURLToPath(new URL('../../packages/ui/src/lib', import.meta.url)),
      '@utils': fileURLToPath(new URL('../../packages/utils/src/lib', import.meta.url))
    };
    return config;
  }
};

export default config;
