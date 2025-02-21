<script>
    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} children The main content
     */
    let { children, class:cls='', ...rest } = $props();
</script>
<div class="layout__content {cls}" {...rest}>
    <!-- Content content -->
    {@render children()}
</div>