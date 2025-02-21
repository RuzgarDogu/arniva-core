<script>
    /**
     * @typedef {Object} Props
     * @property {'light' | 'dark'} [theme] The theme of the layout
     * @property {import('svelte').Snippet} children The layout content
     */
    let { children, theme = 'light', class:cls='', ...rest } = $props();    
</script>

<div class="layout {theme} {cls}" {...rest}>
    {@render children()}
</div>
