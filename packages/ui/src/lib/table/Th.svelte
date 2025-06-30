<script>
    import { stickyColumns } from './stickyColumns.js';

    /**
     * @typedef {Object} Props
     * @property {string} [class] The class to add to the button
     * @property {string} [key] The key to add to the cell
     * @property {number} [colspan] The number of columns to span
     * @property {any} [children] The button contents
     * @property {HTMLElement} [element] The element to bind to
    */

    /** @type {Props} */
    let { children, class: cls = '', key='', colspan = 1, element=$bindable() } = $props();
</script>
<th bind:this={element} 
    class={['table--head--cell', `${cls}`].join(' ')}
    data-cell-key={key}
    data-cell-sortable={key !== ''}
    data-cell-sort-order=""
    class:table--head--cell--sortable={key !== ''}
    use:stickyColumns
    {...(colspan > 1 && { colspan })}
>
    {@render children?.()}
</th>