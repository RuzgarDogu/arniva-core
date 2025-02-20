<script>
    /** @type {{ data: import('./$types').LayoutData, children: import('svelte').Snippet }} */
    import '$lib/styles/app.scss';
    
    let { data, children } = $props();

</script>

{@render children()}