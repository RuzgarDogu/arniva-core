import css from 'rollup-plugin-css-only';

export default {
	plugins: [
		css({ output: 'bundle.css' }) // Extracts all styles into a single CSS file
	]
};
