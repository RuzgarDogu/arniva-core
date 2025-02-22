<script>
    let { children, ...rest } = $props();
</script>

<div class="dropdown-content" {...rest}>
    {@render children?.()}
</div>