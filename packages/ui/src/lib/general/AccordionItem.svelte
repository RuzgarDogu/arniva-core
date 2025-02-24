<script>
    /**
     * @typedef {Object<string, any>} Props
     * @property {string} class
     * @property {string} title
     * @property {boolean} list
     * @property {string} id
     * @property {any} children
     * @property {any} rest
     */
    let random_id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    
    /** @type {Props} */
    let { children, class:cls='', title='', list=false, id=random_id, ...rest } = $props();
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