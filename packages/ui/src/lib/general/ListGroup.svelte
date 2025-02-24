<script>
    /**
     * @typedef {Object<string, any>} Props
     * @property {any} [children] ListGroupItem content
     * @property {any} rest ListGroupItem props
     */
    
    /** @type {Props} */
    let { children, ...rest } = $props();
</script>

<div class="list-group" {...rest}>
    {@render children?.()}
</div>