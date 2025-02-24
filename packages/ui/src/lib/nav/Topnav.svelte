<script>
    /**
     * @typedef {Object<string, any>} Props
     * @property {any} left
     * @property {any} right
     */

    /** @type {Props} */
    let { left, right, ...rest } = $props();
</script>
<div class="top-nav" {...rest}>
    {#if left}
        <div class="top-nav-left">
            {@render left()}
        </div>
    {/if}
    {#if right}
        <div class="top-nav-right">
            {@render right()}
        </div>
    {/if}
</div>