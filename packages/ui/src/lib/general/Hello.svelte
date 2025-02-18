<script>
      /**
   * @typedef {Object} Props
   * @property {string} [name] Name to call
   */

  /** @type {Props} */
const { name = 'world' } = $props();
</script>

<h1>Hello {name}!</h1>

<style>
  h1 {
    font-family: 'Nunito Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
</style>