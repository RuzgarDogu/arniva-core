<script>
    import { onMount } from 'svelte';

    /**
     * @typedef {Object<string, any>} Props
     * @property {string} name The name of the icon to display
     * @property {string} [class] The class to add to the icon container
     * @property {string} [size] The size of the icon
     * @property {string} [width] The width of the icon
     * @property {string} [height] The height of the icon
     * @property {string} [color] The color of the icon
     * @property {boolean} [fit=true] Whether to fit the icon to its container
    */

    /** @type {Props} */
    let { 
        name, 
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
                const module = await import(`./images/${name}.svg?raw`);
                const svgString = module.default;
                
                // Create a temporary container to parse SVG
                const parser = new DOMParser();
                const doc = parser.parseFromString(svgString, 'image/svg+xml');
                const svgElement = doc.documentElement;
                
                // Remove any fixed dimensions from the SVG
                svgElement.removeAttribute('width');
                svgElement.removeAttribute('height');
                
                // Ensure viewBox exists for proper scaling
                if (!svgElement.hasAttribute('viewBox') && 
                    svgElement.hasAttribute('width') && 
                    svgElement.hasAttribute('height')) {
                    const width = svgElement.getAttribute('width');
                    const height = svgElement.getAttribute('height');
                    svgElement.setAttribute('viewBox', `0 0 ${width} ${height}`);
                }
                
                // Process all elements with fill or stroke attributes
                const elementsWithFill = svgElement.querySelectorAll('[fill]:not([fill="none"])');
                elementsWithFill.forEach(el => {
                    const fillValue = el.getAttribute('fill');
                    // Only replace if it's a hex color or named color (not "none", "url(...)", etc.)
                    if (fillValue && (fillValue.startsWith('#') || isNamedColor(fillValue))) {
                        el.setAttribute('fill', 'currentColor');
                    }
                });
                
                const elementsWithStroke = svgElement.querySelectorAll('[stroke]:not([stroke="none"])');
                elementsWithStroke.forEach(el => {
                    const strokeValue = el.getAttribute('stroke');
                    // Only replace if it's a hex color or named color
                    if (strokeValue && (strokeValue.startsWith('#') || isNamedColor(strokeValue))) {
                        el.setAttribute('stroke', 'currentColor');
                    }
                });
                
                // For SVG path elements without fill or stroke attributes, add fill="currentColor"
                const pathsWithoutAttributes = svgElement.querySelectorAll('path:not([fill]):not([stroke])');
                pathsWithoutAttributes.forEach(path => {
                    path.setAttribute('fill', 'currentColor');
                });
                
                // Append the SVG to our component's DOM
                iconContainer.appendChild(svgElement);
            }
        } catch (e) {
            console.error(e);
        }
    });
    
    // Helper function to detect named colors
    /**
     * @param {string} color
     * @returns {boolean}
     * @param color
     */
    function isNamedColor(color) {
        // Basic named colors - expand this list as needed
        const namedColors = [
            'black', 'silver', 'gray', 'white', 'maroon', 'red', 'purple',
            'fuchsia', 'green', 'lime', 'olive', 'yellow', 'navy', 'blue',
            'teal', 'aqua', 'orange', 'aliceblue', 'antiquewhite', 'aquamarine',
            'azure', 'beige', 'bisque', 'blanchedalmond', 'blueviolet', 'brown',
            'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral',
            'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue',
            'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey',
            'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange',
            'darkorchid', 'darkred', 'darksalmon', 'darkseagreen',
            'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise',
            'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey',
            'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen',
            'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'greenyellow',
            'grey', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory',
            'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon',
            'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow',
            'lightgray', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon',
            'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey',
            'lightsteelblue', 'lightyellow', 'limegreen', 'linen', 'magenta',
            'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple',
            'mediumseagreen', 'mediumslateblue', 'mediumspringgreen',
            'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream',
            'mistyrose', 'moccasin', 'navajowhite', 'oldlace', 'olivedrab',
            'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise',
            'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum',
            'powderblue', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon',
            'sandybrown', 'seagreen', 'seashell', 'sienna', 'skyblue',
            'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen',
            'steelblue', 'tan', 'thistle', 'tomato', 'turquoise', 'violet',
            'wheat', 'whitesmoke', 'yellowgreen'
        ];
        
        return namedColors.includes(color.toLowerCase());
    }

    // Calculate classes based on props
    let classes = $derived.by(() => {
        const classArray = ['icon'];
        
        if (size) classArray.push('icon--size');
        else if (width) classArray.push('icon--width');
        else if (height) classArray.push('icon--height');
        else if (fit) classArray.push('icon--fit');
        
        if (cls) classArray.push(cls);
        
        return classArray.join(' ');
    });
    
    // Calculate style based on props
    let style = $derived.by(() => {
        const styles = [`--icon-color: ${color};`];
        
        if (size) styles.push(`--icon-size: ${size};`);
        if (width || size) styles.push(`--icon-width: ${width || size};`);
        if (height || size) styles.push(`--icon-height: ${height || size};`);
        
        return styles.join(' ');
    });
</script>

<div 
    bind:this={iconContainer}
    class={classes}
    style={style}
></div>
