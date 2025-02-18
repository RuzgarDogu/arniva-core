<script>
    /**
     * @typedef {Object} Props
     * @property {number} [value] Value to display
     */
    const { value = 0 } = $props();
</script>

<input type="number" value={value} />

<style>
    input {
        border: 1px solid #ccc;
        border-radius: 4px;
        padding: 8px;
        font-size: 16px;
    }
</style>