<script>
    /**
     * @typedef {Object} Props
     * @property {string} [class] Custom class
     */



    let { children, class:cls = '' } = $props()
</script>

<div class="card" class:cls>
    {@render children?.()}
</div>