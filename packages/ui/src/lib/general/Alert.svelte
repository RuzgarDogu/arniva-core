<script>
    /**
     * @typedef {Object} Props
     * @property {string} title
     * @property {'primary' | 'secondary' | 'default' | 'accent' | 'success' | 'danger' | 'warning'} color
     * @property {any} rest
     */
    let { children, title='', color='default', ...rest } = $props();
</script>

<div class="alert alert--{color}" {...rest}>
    {#if title}
        <div class="alert-title">{title}</div>
    {/if}
    {@render children?.()}
</div>