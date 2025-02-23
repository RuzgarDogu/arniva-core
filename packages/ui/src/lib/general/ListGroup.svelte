<script>
    /**
     * @typedef {Object} Props
     * @property {any} [children] ListGroupItem content
     * @property {any} rest ListGroupItem props
     */
    let { children, ...rest } = $props();
</script>

<div class="list-group" {...rest}>
    {@render children?.()}
</div>