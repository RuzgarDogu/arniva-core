<script>
    /**
     * @typedef {Object} Props
     * @property {string} class
     * @property {string} title
     * @property {boolean} list
     * @property {any} rest
     */
    let id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    let { children, class:cls='', title='', list=false, ...rest } = $props();
</script>

<div class="accordion-item {cls}" {...rest} id={id}>
    <div class="accordion-header">
        {title}
    </div>
    {#if list}
    <ul class="accordion-content list">
        {@render children?.()}
    </ul>
    {:else}
    <div class="accordion-content">
        {@render children?.()}
    </div>
    {/if}
</div>