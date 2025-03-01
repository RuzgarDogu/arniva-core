<script>
    import { onMount } from 'svelte';

    /**
     * @typedef {Object<string, any>} Props
     * @property {string} icon The name of the icon to display
     * @property {string} [class] The class to add to the icon container
     * @property {string} [size] The size of the icon
     * @property {string} [width] The width of the icon
     * @property {string} [height] The height of the icon
     * @property {string} [color] The color of the icon
     * @property {boolean} [fit=true] Whether to fit the icon to its container
    */

    /** @type {Props} */
    let { 
        icon, 
        class:cls='',
        size,
        width,
        height,
        color = 'currentColor',
        fit = true
    } = $props();
    
    /** @type {HTMLDivElement|null} */
    let iconContainer;
    
    onMount(async () => {
        try {
            // Clear previous content
            if (iconContainer) {
                iconContainer.innerHTML = '';
                
                // Load the SVG
                const module = await import(`./images/${icon}.svg?raw`);
                const svgString = module.default;
                
                // Create a temporary container to parse SVG
                const parser = new DOMParser();
                const doc = parser.parseFromString(svgString, 'image/svg+xml');
                const svgElement = doc.documentElement;
                
                // Append the SVG to our component's DOM
                iconContainer.appendChild(svgElement);
            }
        } catch (e) {
            console.error(e);
        }
    });

    // Determine if we should use explicit sizing or auto-fitting
    // Now using the fit prop for additional control
    let useExplicitSize = $derived.by(() => {
        return !fit || size !== undefined || width !== undefined || height !== undefined;
    });
</script>

<div 
    bind:this={iconContainer}
    class={['icon', useExplicitSize ? '' : 'icon--fit', cls].join(' ')} 
    style={useExplicitSize ? `
        --icon-size: ${size || '24px'}; 
        --icon-width: ${width || size || '24px'}; 
        --icon-height: ${height || size || '24px'};
        --icon-color: ${color};
    ` : `--icon-color: ${color};`}
></div>


<style>

</style>