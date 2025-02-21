<script>
    /**
     * @typedef {Object} Props
     * @property {string} class
     * @property {any} rest
     * @property {boolean} icon
     * @property {any} children
     */
     let {class:cls = '', children, icon=false } = $props();
</script>
<div class="form-input-group {cls}" class:icon>
    {#if children}
        {@render children()}
    {/if}
</div>