<script>
    /**
     * @typedef {Object} Props
     * @property {import('svelte').Snippet} children The aside content
     * @property {string} [mode] The mode of the layout
     */
    let { children, class:cls='', ...rest } = $props();
</script>
<aside class="layout__sidebar {cls}" {...rest}>
    <!-- Sidebar content -->
    {@render children()}
  </aside>