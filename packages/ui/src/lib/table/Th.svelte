<script>
    import { stickyColumns } from './stickyColumns.js';

    /**
     * @typedef {Object} Props
     * @property {string} [class] The class to add to the button
     * @property {string} [key] The key to add to the cell
     * @property {any} [children] The button contents
    */

    /** @type {Props} */
    let { children, class: cls = '', key='', element=$bindable() } = $props();
</script>
<th bind:this={element} 
    class={['table--head--cell', `${cls}`].join(' ')}
    data-cell-key={key}
    data-cell-sortable={key !== ''}
    data-cell-sort-order=""
    class:table--head--cell--sortable={key !== ''}
    use:stickyColumns
>
    {@render children?.()}
</th>