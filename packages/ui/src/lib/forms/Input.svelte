<script>
    /**
     * @typedef {Object} Props
     * @property {string} class
     * @property {any} rest
     */

    /**
     * @param {Props} props
     */
    let {class:cls = '', ...rest} = $props();
</script>
<input class="form-input {cls}" {...rest}/>