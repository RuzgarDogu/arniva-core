<script>
    /**
     * @typedef {Object} Props
     * @property {number} [value] Value to display
     */
    const { value = 0 } = $props();
</script>

<input type="number" value={value} />