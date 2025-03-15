<script>

    /**
     * @typedef {Object<string, any>} Props
     * @property {string} [id] The spinner id
     * @property {'fixed' | 'absolute' | 'relative'} [position] The spinner position
     * @property {string} [color] The spinner color
     * @property {string} [width] The spinner width
     * @property {string} [height] The spinner height
     * @property {string} [borderWidth] The spinner border width
     * @property {string} [backgroundColor] The spinner background color
     */

    let random_id = Date.now().toString(36) + Math.random().toString(36).substring(2);

    /** @type {Props} */
    let { id=random_id, position='relative', color="blue", width='100px', height='100px', borderWidth='4px', backgroundColor='rgba(0, 0, 0, 0.1)' } = $props();
</script>
{#if position === 'fixed' || position === 'absolute'}
    <div class="spinner-backdrop spinner-backdrop-{position}" id="backdrop-spinner-{id}" style="background-color: rgb(0, 0, 0); opacity: 0.1;"></div>
{/if}
<div id="spinner-{id}" class="spinner-wrapper spinner-position-{position}">
    <div class="spinner" style="border-color: {backgroundColor}; border-top-color: {color}; width: {width}; height: {height}; border-width: {borderWidth};"></div>
</div>