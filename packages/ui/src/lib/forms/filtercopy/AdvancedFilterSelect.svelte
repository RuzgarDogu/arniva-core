<script>
    let { field } = $props();
    
    // Initialize the selected value state
    let selectedOption = $state('');
    
    // Function to handle selection change
    function handleSelection(value) {
        selectedOption = value;
        
        // Update the field value in parent component
        field.value = value;
    }
    
    // Helper function to determine if options are simple strings or objects
    function isSimpleOptions(options) {
        return options && options.length > 0 && typeof options[0] !== 'object';
    }
</script>

<div class="advanced-filter-select">
    <div class="filter-header">
        <p class="filter-title">{field.text}</p>
    </div>
    
    <div class="filter-options">
        {#if isSimpleOptions(field.options)}
            <!-- For simple string array options -->
            {#each field.options as option}
                <div class="advanced-filter--item">
                    <label class="radio-label">
                        <input 
                            type="radio" 
                            name={field.name} 
                            value={option} 
                            checked={selectedOption === option}
                            on:change={() => handleSelection(option)} 
                        />
                        <span class="option-text">{option}</span>
                    </label>
                </div>
            {/each}
        {:else}
            <!-- For object options with label/value pairs -->
            {#each field.options as option}
                <div class="advanced-filter--item">
                    <label class="radio-label">
                        <input 
                            type="radio" 
                            name={field.name} 
                            value={option.value} 
                            checked={selectedOption === option.value}
                            on:change={() => handleSelection(option.value)} 
                        />
                        <span class="option-text">{option.label}</span>
                    </label>
                </div>
            {/each}
        {/if}
    </div>
    
    <div class="filter-footer">
        <button class="btn-clear" on:click={() => handleSelection('')}>
            Clear
        </button>
    </div>
</div>

<style>
    .advanced-filter-select {
        padding: 8px;
        display: flex;
        flex-direction: column;
        min-width: 200px;
    }
    
    .filter-header {
        margin-bottom: 12px;
        border-bottom: 1px solid #eee;
    }
    
    .filter-title {
        font-size: 14px;
        font-weight: 500;
        margin: 0;
        padding-bottom: 8px;
    }
    
    .filter-options {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }
    
    .filter-option {
        padding: 4px 0;
    }
    
    .radio-label {
        display: flex;
        align-items: center;
        cursor: pointer;
        gap: 8px;
    }
    
    .option-text {
        font-size: 14px;
    }
    
    .filter-footer {
        margin-top: 12px;
        border-top: 1px solid #eee;
        padding-top: 8px;
        display: flex;
        justify-content: flex-end;
    }
    
    .btn-clear {
        background: transparent;
        border: none;
        color: #666;
        cursor: pointer;
        font-size: 12px;
        padding: 4px 8px;
    }
    
    .btn-clear:hover {
        text-decoration: underline;
    }
</style>