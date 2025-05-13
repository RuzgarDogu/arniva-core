<script>

    /**
     * @typedef {Object} Props
     * @property {string} [class] The class to add to the button
     * @property {string} [key] The key to add to the cell
     * @property {any} [children] The button contents
    */

    /** @type {Props} */
    let { children, class: cls = '', key='' } = $props();
</script>
<th class={['table--head--cell', `${cls}`].join(' ')}
    data-cell-key={key}
    data-cell-sortable={key !== ''}
    data-cell-sort-order=""
    class:table--head--cell--sortable={key !== ''}
>
    {@render children?.()}
</th>