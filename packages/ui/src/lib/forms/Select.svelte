<script>
    let { children, class:cls='', ...rest } = $props();
</script>

<select class="form-select {cls}" {...rest}>
    {@render children?.()}
</select>