<script>
    /** @type {{ data: import('./$types').PageData }} */
    import { Input } from '$lib';
    import { onMount } from 'svelte';

    let { data } = $props();
    
    /**
     * @type {HTMLInputElement | null} 
     */
    let el = $state(null);

    onMount(() => {
        console.log('mounted');
        if(!el) return;
        el.focus()
        setTimeout(() => {
            if (el) el.value = 'Hello'
        }, 1000)
    });

</script>

<Input bind:element={el}/>