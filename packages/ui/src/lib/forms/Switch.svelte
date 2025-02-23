<script>
    let random_id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    let {
        trueText = '',
        falseText = '',
        value = false, 
        disabled = false, 
        name = '', 
        id = random_id, 
        label = '', 
        required = false, 
        onChange,
        color = 'default',
        reverse = false,
        ...rest
    } = $props();

    // Handle change event
    function handleChange(event) {
        value = event.target.checked;
        if (onChange) {
            onChange(value);
        }
    }
</script>

<div class="switch switch--{color}"
class:switch--reverse={reverse}
{...rest}>
    {#if label}
        <label for={id} class="switch--label">{label}</label>
    {/if}
    <input class="switch--input" id={id} type="checkbox" role="switch" aria-checked={value} name={name} disabled={disabled} required={required} checked={value} onchange={handleChange}>
    <label class="switch--input-label" aria-disabled="false" for={id} aria-label="dropdown">
        <span aria-hidden="true">{falseText}</span>
        <span aria-hidden="true">{trueText}</span>
      </label>
</div>


<!-- 
<div class="switch switch--{color}"
class:switch--reverse={reverse}
{...rest}>
    {#if label}
        <label for={generatedId} class="switch-label">{label}</label>
    {/if}
    
    <div class="switch-container">
        <input
            type="checkbox"
            id={generatedId}
            {name}
            checked={value}
            {disabled}
            {required}
            onchange={handleChange}
            class="hidden-checkbox"
        />
        
        <label for={generatedId} class="switch-toggle"></label>
    </div>
</div>
 -->
