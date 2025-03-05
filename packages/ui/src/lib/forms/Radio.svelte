<script>

  /**
   * @typedef {Object} Props
   * @property {string} [class] - CSS class for the radio component
   * @property {string} [label] - Label text for the radio button
   * @property {string} [style] - Inline CSS styles
   * @property {string} [id] - Unique identifier for the radio button
   * @property {string} [name] - Name attribute for the radio button
   * @property {string} [value] - Value of the radio button
   * @property {boolean} [checked] - Whether the radio button is checked
   * @property {(event: Event) => void} [onchange] - Function to call when the radio button value changes
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
  
  <div class={['custom-radio', cls].join(' ')} style={style}>
    <input 
      type="radio" 
      {id} 
      {name} 
      {value} 
      {checked}
      onchange={onchange}
      {...rest} 
    />
    <label for={id}>{label}</label>
  </div>