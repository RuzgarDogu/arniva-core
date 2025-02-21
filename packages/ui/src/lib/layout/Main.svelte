<script>
    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} children The main content
     */
    let { children, class:cls='', ...rest } = $props();
</script>
<main class="layout__main {cls}" {...rest}>
    {@render children()}
</main>
