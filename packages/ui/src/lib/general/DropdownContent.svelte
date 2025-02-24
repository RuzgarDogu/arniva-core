<script>

    /**
     * @typedef {Object<string, any>} Props
     * @property {any} [children] The dropdown content
     */

    /** @type {Props} */
    let { children, ...rest } = $props();
</script>

<div class="dropdown-content" {...rest}>
    {@render children?.()}
</div>