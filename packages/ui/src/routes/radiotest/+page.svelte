<script>
    /** @type {{ data: import('./$types').PageData }} */
    let { data } = $props();
    const addressTypes = [
	{ id: 1, name: 'Fatura Adresi', color: 'primary' },
	{ id: 2, name: 'Sevk Adresi', color: 'success' },
	{ id: 3, name: 'Genel Adres', color: 'warning' }
];

let testing = $state(null)
import { Radio } from '$lib';
</script>
<h1>{testing}</h1>
<div class="d-flex align-items-center justify-content-end gap-2 mb-2">
    {#each addressTypes as type (type.id)}
        <Radio
            name="adres_cins"
            label={type.name}
            color="primary"
            boxed
            class="w-100"
            value={type.id}
            bind:group={testing}
        />
    {/each}
</div>