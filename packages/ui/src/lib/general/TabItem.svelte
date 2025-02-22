<script>
    let { children, title='', ...rest } = $props();
</script>

<div class="tab-item">
    <div class="tab-item-header">
        {title}
    </div>
    <div class="tab-item-content">
        {@render children()}
    </div>
</div>