<script>
    /** @type {{ data: import('./$types').LayoutData, children: import('svelte').Snippet }} */
    let { data, children } = $props();

    import '$lib/styles/app.scss'
</script>

{@render children()}