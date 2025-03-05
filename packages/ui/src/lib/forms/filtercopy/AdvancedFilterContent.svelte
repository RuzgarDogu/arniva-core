<script>
    let { field } = $props();
    import AdvancedFilterRange from './AdvancedFilterRange.svelte';
    import AdvancedFilterSelect from './AdvancedFilterSelect.svelte';
    import AdvancedFilterMultiselect from './AdvancedFilterMultiselect.svelte';
    import AdvancedFilterBoolean from './AdvancedFilterBoolean.svelte';
</script>

{#if !field}
    <div class="text-center text-gray-500">No fields to display</div>
{:else}

    {#if field.type === 'range'}
    <AdvancedFilterRange {field} />
    {:else if field.type === 'select'}
    <AdvancedFilterSelect {field} />
    {:else if field.type === 'multiselect'}
    <AdvancedFilterMultiselect {field} />
    {:else if field.type === 'boolean'}
    <AdvancedFilterBoolean {field} />
    {/if}

{/if}