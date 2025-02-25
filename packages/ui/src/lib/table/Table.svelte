<script>
    /**
     * @typedef {Object} Props
     * @property {'normal' | 'large' | 'compact'} [size] How large should the button be?
     * @property {'default' | 'stripe'} [type] The table type
     * @property {'normal' | 'sticky' | 'static'} [headerType] Header type "normal" or "sticky" or "static"
     * @property {'inline' | 'full' | 'none'} [border] The table border type
     * @property {string} [height] The table height
     * @property {string} [class] The table class
     * @property {string} [id] The table id
     * @property {any} [children] The button contents
     * @property {string} [class] The class to add to the button
     */
  
    /** @type {Props} */
    let { children, class:cls='', size = 'normal', id='', type='default', border='inline', height='auto', headerType='normal' } = $props();
  </script>


{#snippet tablecontent()}
<table
class={['table', `${cls}`, `table--${type}`, `table--border--${border}`, `table--size--${size}`, `table--header-type-${headerType}`].join(' ')}
id={id}
>
{@render children?.()}
</table>
{/snippet}

{#if headerType === 'static'}
<div class="table-container" style="height: {height}; overflow-y: auto;">
    {@render tablecontent()}
</div>
{:else}
    {@render tablecontent()}
{/if}