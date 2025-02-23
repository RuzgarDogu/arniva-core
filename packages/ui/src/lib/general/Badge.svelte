<script>
    /**
     * @typedef {Object} Props
     * @property {string} title
     * @property {'primary' | 'secondary' | 'default' | 'accent' | 'success' | 'danger' | 'warning'} color
     * @property {'small' | 'medium' | 'large'} size
     * @property {boolean} rounded
     * @property {any} rest
     */
    let { title='', color='default', rounded=false, size='small', ...rest } = $props();
</script>

<span class="badge badge--{color} badge--{size}" class:badge--rounded={rounded} {...rest}>
    {title}
</span>