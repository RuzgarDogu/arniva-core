<script>
    /**
     * @typedef {Object} Props
     * @property {string} [class] Custom class
     * @property {any} [children] The card contents
     */


    /** @type {Props} */
    let { children, class:cls = '' } = $props()
</script>

<div class="card" class:cls>
    {@render children?.()}
</div>