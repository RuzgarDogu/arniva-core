<script>
    /**
     * @typedef {Object<string, any>} Props
     * @property {string} [class]
     */
  
    /** @type {Props} */
    let { class: cls = '', ...rest } = $props();
  </script>
  
  <input class="form-input {cls}" {...rest}/>
  