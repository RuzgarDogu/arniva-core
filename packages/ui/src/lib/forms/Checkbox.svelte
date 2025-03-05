<script>
  /**
   * @typedef {Object} Props
   * @property {string} [class]
   * @property {string} [label]
   * @property {string} [style]
   * @property {string} [id]
   * @property {string} [name]
   * @property {string} [value]
   * @property {boolean} [checked] - Whether the checkbox is checked
   * @property {(event: Event) => void} [onchange] - Function to call when the checkbox value changes
   */

    let random_id = Date.now().toString(36) + Math.random().toString(36).substring(2);

    /** @type {Props} */
    let { 
      class: cls = '', 
      label = '', 
      style = '', 
      id = random_id, 
      name = '', 
      value, 
      checked,
      onchange,
      ...rest 
    } = $props();
  </script>
  
  <div class={['custom-checkbox', cls].join(' ')} style={style}>
    <input 
      type="checkbox" 
      {id} 
      {name} 
      {value}
      {checked}
      onchange={onchange} 
      {...rest} 
    />
    <label for={id}>{label}</label>
  </div>