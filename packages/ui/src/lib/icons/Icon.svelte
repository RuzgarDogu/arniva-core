<script>
    /**
     * Icon component using locally stored Iconify icon sets
     * This approach avoids HTTP requests by using local JSON files
     * Currently supporting: MDI icons
     *
     * Usage: <Icon icon="mdi:content-save" width={24} height={24} />
     */
    import mdiIcons from '@iconify-json/mdi/icons.json';
    
    // Import additional icon sets as needed:
    // import faIcons from '@iconify-json/fa/icons.json';
    // import materialIcons from '@iconify-json/ic/icons.json';
    
    /**
     * @typedef {Object} IconSet
     * @property {Object.<string, {body: string}>} icons - Icon definitions
     * @property {number} [width] - Default width for icons
     * @property {number} [height] - Default height for icons
     */
    
    /**
     * @typedef {Object} IconData
     * @property {string} body - SVG body content
     * @property {number} width - Icon width
     * @property {number} height - Icon height
     */
    
    let { icon, width = 24, height = 24 } = $props();
    
    // Parse the icon name to get the prefix and iconName
    let [prefix, iconName] = icon.split(':');
    
    // Convert width and height to numbers if they are strings
    width = typeof width === 'string' ? parseInt(width, 10) : width;
    height = typeof height === 'string' ? parseInt(height, 10) : height;
    
    /**
     * Function to get icon data based on the prefix and name
     * @returns {IconData|null} The icon data or null if not found
     */
    function getIconData() {
        // Use a safer property check
        if (prefix === 'mdi' && iconName && 
            typeof mdiIcons === 'object' && mdiIcons !== null &&
            'icons' in mdiIcons && typeof mdiIcons.icons === 'object' && 
            mdiIcons.icons !== null && iconName in mdiIcons.icons) {
            
            /** @type {{body: string}} */
            const iconObj = /** @type {IconSet} */ (mdiIcons).icons[iconName];
            
            if (iconObj && typeof iconObj === 'object' && 'body' in iconObj) {
                return {
                    body: iconObj.body,
                    width: /** @type {IconSet} */ (mdiIcons).width || 24,
                    height: /** @type {IconSet} */ (mdiIcons).height || 24
                };
            }
        }
        // Add more icon sets here as needed
        return null;
    }
    
    // Use reactive derived values
    const iconData = $derived(getIconData());
	/* eslint svelte/no-at-html-tags: "error" */
</script>

{#if iconData}
    <!-- We use {@html} here since we trust the source (our own package) -->
    <!-- The body content comes from the official Iconify library -->
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={width} 
        height={height} 
        viewBox="0 0 {iconData.width} {iconData.height}"
        role="img"
        aria-label={iconName}
    >
		 <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html iconData.body}
    </svg>
{:else}
    <div style="width:{width}px;height:{height}px;display:grid;place-items:center;border:1px dashed #ccc;">
        Icon not found: {icon}
    </div>
{/if}