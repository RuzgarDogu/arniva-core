<script>
    /**
     * @typedef {Object<string, any>} Props
     * @property {string} class
     * @property {any} rest
     * @property {any} children
     */

    /** @type {Props} */
    let { children, class:cls='', ...rest } = $props();
</script>

<select class="form-select {cls}" {...rest}>
    {@render children?.()}
</select>