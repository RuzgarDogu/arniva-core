<script>
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