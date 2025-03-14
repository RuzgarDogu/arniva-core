import '../../packages/ui/src/lib/styles/app.scss';
import './storybook.css';

// Add Google Font link
const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

// Add global styles for Storybook
const customFontStyles = `
  #storybook-root, #storybook-root > *, .sb-story {
    font-family: "Nunito Sans",-apple-system,".SFNSText-Regular","San Francisco",BlinkMacSystemFont,"Segoe UI","Helvetica Neue",Helvetica,Arial,sans-serif;
  }
`;

const style = document.createElement('style');
style.innerHTML = customFontStyles;
document.head.appendChild(style);

/** @type { import('@storybook/svelte').Preview } */
const preview = {
	parameters: {
		options: {
			storySort: {
				order: [
					'Welcome',
					'UI',
					['Layout', ['Layout', 'Aside', 'Main', 'Content'], 'Nav', 'General', 'Forms'],
					'Utils',
					'Api', ['Intro', 'Core Features', 'Install & Import', 'Request Types', 'Basic Usage', 'Advanced Usage', 'Configuration', 'Advanced Configuration', 'Best Practices', 'Error Handling', 'Interceptors', 'Typescript', 'Browser Compatibility']
				]
			}
		},
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i
			}
		}
	}
};

export default preview;
