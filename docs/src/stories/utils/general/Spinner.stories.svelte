<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { Button } from '@ui/general';
	import { spinner } from '@utils';

	const { Story } = defineMeta({
		title: 'Utils/General/Spinner',
        argTypes: {
            position: {
                control: { type: 'select' },
                options: ['fixed', 'absolute', 'relative']
            },
            showBackdrop: { control: 'boolean' },
            className: { control: 'text' },
            id: { control: 'text' },
            type: {
                control: { type: 'select' },
                options: ['default', 'crescent']
            },
            container: { control: 'text' },
            text: { control: 'text' },
            adaptSize: { control: 'boolean' },
            sizeFactor: { control: 'number' },
            minSize: { control: 'number' },
            maxSize: { control: 'number' },
            sizeMargin: { control: 'number' },
            color: { control: 'color' },
            backgroundColor: { control: 'color' },
            backdropColor: { control: 'color' },
            backdropOpacity: { control: 'number' }
        }
	});

/**
 * @typedef {Object} SpinnerConfigProps
 * @property {'fixed' | 'absolute' | 'relative'} [position] - Position of the spinner
 * @property {boolean} [showBackdrop] - Whether to show a backdrop (only for fixed and absolute)
 * @property {string} [className] - Additional CSS classes to add to the spinner
 * @property {string} [id] - Custom ID for the spinner (if not provided, will be generated from name)
 * @property {string} [type] - Type of spinner (default or crescent)
 * @property {HTMLElement|string|null} [container] - Container element or selector to append the spinner to (defaults to body)
 * @property {string} [text] - Optional text to display with the spinner
 * @property {boolean} [adaptSize] - Whether to adapt the spinner size to its container
 * @property {number} [sizeFactor] - Factor to multiply container dimensions (0-1, default 0.6)
 * @property {number} [minSize] - Minimum size in pixels
 * @property {number} [maxSize] - Maximum size in pixels
 * @property {number} [sizeMargin] - Margin to subtract from container dimensions
 * @property {string} [color] - Color of the spinner's moving part
 * @property {string} [backgroundColor] - Color of the spinner's background/track
 * @property {string} [backdropColor] - Color of the backdrop (when showBackdrop is true)
 * @property {number} [backdropOpacity] - Opacity of the backdrop (0-1)
 */

    const testSpinner = (config) => {
        const { name, ...rest } = config;
        console.log(JSON.stringify(config));
        spinner.show(name, rest);
        setTimeout(() => {
            spinner.hide(name);
        }, 3000);
    }

    const testSpinnerAbsolute = (config) => {
        const { name, ...rest } = config;
        spinner.show(name, rest);
        setTimeout(() => {
            spinner.hide(name);
        }, 3000);
    }

    const testSpinnerFixed = (config) => {
        const { name, ...rest } = config;
        spinner.show(name, rest);
        setTimeout(() => {
            spinner.hide(name);
        }, 3000);
    }

</script>

<Story
	name="Default Spinner"
	exportName="Default"
	args={{
			container: '#spinnerTest',
            name: 'spinnerTest',
	}}
>
	{#snippet children(args)}
        <p>Click the button below to show the spinner</p>
        <div id="spinnerTest" style="padding: 20px;">
        </div>
        <Button onClick={() => testSpinner(args)}>Show Spinner</Button>
	{/snippet}
</Story>

<Story
	name="Absolute Spinner"
	exportName="Absolute"
	args={{
		container: '#spinnerTestAbsolute',
        position: 'absolute',
        name: 'spinnerTestAbsolute',
	}}
>
	{#snippet children(args)}
        <div id="spinnerTestAbsolute" style="padding: 20px; position:relative; margin-bottom: 20px;">
            Click the button below to show the spinner
        </div>
        <Button onClick={() => testSpinnerAbsolute(args)}>Show Spinner</Button>
	{/snippet}
</Story>

<Story
	name="Fixed Spinner"
	exportName="Fixed"
	args={{
		container: '#spinnerTestFixed',
        position: 'fixed',
        name: 'spinnerTestFixed',
	}}
>
	{#snippet children(args)}
        <div id="spinnerTestFixed" style="padding: 20px; position:relative; margin-bottom: 20px;">
            Click the button below to show the spinner
        </div>
        <Button onClick={() => testSpinnerFixed(args)}>Show Spinner</Button>
	{/snippet}
</Story>

<Story
	name="Button Spinner"
	exportName="ButtonSpinner"
	args={{
			container: '#spinnerTestButton',
            name: 'spinnerTestButton',
	}}
>
	{#snippet children(args)}
        <p>Click the button below to show the spinner</p>
        <Button id="spinnerTestButton" onClick={() => testSpinner(args)}>Show Spinner</Button>
	{/snippet}
</Story>