import '../../packages/ui/src/lib/styles/app.scss'

/** @type { import('@storybook/svelte').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;