<script>
    /** 
     * @typedef {Object<string, any>} Props
     * @property {any} children Slot for component
     * @property {string} [label] Label for the group item
     * @property {boolean} [required] Is the group item required?
     */

     /** @type {Props} */
    let { children, label='', required=false } = $props();
</script>
<tr class="form-group-item">
    <td class="form-group-item--label">{label}
        {#if required}
            <span class="required">*</span>
        {/if}
    </td>
    <td class="form-group-item--input">
        {@render children?.()}
    </td>
</tr>