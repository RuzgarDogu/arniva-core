<script>
      /**
   * @typedef {Object} Props
   * @property {string} [name] Name to call
   */

  /** @type {Props} */
const { name = 'world' } = $props();
</script>

<h1>Hello {name}!</h1>