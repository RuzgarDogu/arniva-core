<script>
    /**
     * @typedef {Object<string, any>} Props
     * @property {any} [children] The table row contents
     * @property {string} [class] The table row class
    */

    /** @type {Props} */
    let { children, class:cls='' } = $props();
</script>

<tr
class={['table--row', `${cls}`].join(' ')}
>
{@render children?.()}
</tr>