<script>
    /**
     * @typedef {Object<string, any>} Props
     * @property {import('svelte').Snippet} children The main content
     * @property {string} [class] The class to add to the main content
     */

    /** @type {Props} */
    let { children, class:cls='', ...rest } = $props();
</script>
<main class="layout__main {cls}" {...rest}>
    {@render children()}
</main>
