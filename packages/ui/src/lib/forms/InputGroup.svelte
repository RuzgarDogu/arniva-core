<script>
    /**
     * @typedef {Object<string, any>} Props
     * @property {string} class
     * @property {any} rest
     * @property {boolean} icon
     * @property {any} children
     */

    /** @type {Props} */
     let {class:cls = '', children, icon=false, ...rest } = $props();
</script>
<div class="form-input-group {cls}" class:icon {...rest}>
    {#if children}
        {@render children()}
    {/if}
</div>