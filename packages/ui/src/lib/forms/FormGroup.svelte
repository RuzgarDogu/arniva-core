<script>
    let { children, ...rest } = $props();
</script>

<table class="form-group" {...rest}>
    <tbody>
        {@render children?.()}
    </tbody>
</table>