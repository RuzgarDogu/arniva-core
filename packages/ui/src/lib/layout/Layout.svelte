<script>
    /**
     * @typedef {Object<string, any>} Props
     * @property {'light' | 'dark'} [theme] The theme of the layout
     * @property {import('svelte').Snippet} children The layout content
     * @property {string} [class] The class to add to the layout
     */

    /** @type {Props} */
    let { children, theme = 'light', class:cls='', ...rest } = $props();    
</script>

<div class="layout {theme} {cls}" {...rest}>
    {@render children()}
</div>
