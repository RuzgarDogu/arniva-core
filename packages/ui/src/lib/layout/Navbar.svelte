<script>
    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} children The navigation content
     */
    let { children, class:cls='', ...rest } = $props();
</script>
<div class="layout__nav {cls}" {...rest}>
    <!-- Navigation content -->
    {@render children()}
</div>
