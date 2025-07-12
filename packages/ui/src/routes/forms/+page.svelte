<script>
    /** @type {{ data: import('./$types').PageData }} */

    import { Button, Dropdown, DropdownContent, Input, InputGroup, DatePicker, Icon, Select, Form } from '$lib';

    let { data } = $props();

    const onSelect = (item) => {
        console.log(item);
    };

    class Validator {
        instance = $state(null);
        validationErrors = $state([]);
        hidetext = $state(false);

        validationState = $derived.by(() => {
            let errors = JSON.parse(JSON.stringify(this.validationErrors));
            this.validationErrors.forEach(error => {
                console.log(`_________Validation error for ${error.name}: ${error.message}`);
                let value = this.instance[error.name];
                if (!value) {
                    // remove the error from validationErrors if the value is valid
                    // this.validationErrors = this.validationErrors.filter(e => e.name !== error.name);
                    this.setDomError(error);
                } else {
                    this.removeDomError(error);
                    // remove from errors if the value is valid
                    errors = errors.filter(e => e.name !== error.name);
                }
            });
            return errors.length > 0;
        });

        constructor(instance) {
            this.instance = instance;
        }

       removeDomError(error) {
            // Implement logic to remove the error visualization
            let form = document.querySelector(`form[name="${this.instance.validationRules.form}"]`);
            if (!form) {
                console.error('Form not found:', this.instance.validationRules.form);
                return;
            }
            // Example: Remove error class and message
            let field = form.querySelector(`[name="${error.name}"]`);
            if (field) {
                // Check if the field is inside a DatePicker component
                const datePickerContainer = field.closest('.datepicker');
                if (datePickerContainer) {
                    // For DatePicker, apply error styling to the .datepicker container
                    datePickerContainer.classList.remove('form-input--error');
                    if (!this.hidetext) {
                        const errorMessage = datePickerContainer.nextElementSibling;
                        if (errorMessage && errorMessage.classList.contains('form-input--error--text')) {
                            errorMessage.remove();
                        }
                    }
                } else {
                    // Check if the field is not an input element, try to find one inside
                    const inputElements = ['INPUT', 'SELECT', 'TEXTAREA'];
                    if (!inputElements.includes(field.tagName)) {
                        const innerInput = field.querySelector('input, select, textarea');
                        if (innerInput) {
                            field = innerInput;
                        }
                    }
                    
                    field.classList.remove('form-input--error');
                    if (!this.hidetext) {
                        const errorMessage = field.nextElementSibling;
                        if (errorMessage && errorMessage.classList.contains('form-input--error--text')) {
                            errorMessage.remove();
                        }
                    }
                }
            } else {
                console.warn('Field not found for error:', error.name);
            }
        }

        setDomError(error) {
            // Implement visualization logic here, e.g., highlight fields, show messages, etc.
            let form = document.querySelector(`form[name="${this.instance.validationRules.form}"]`);
            if (!form) {
                console.error('Form not found:', this.instance.validationRules.form);
                return;
            }
            // Example: Highlight fields with errors
            let field = form.querySelector(`[name="${error.name}"]`);
            if (field) {
                console.log('Setting error for field:', field);
                
                // Check if the field is inside a DatePicker component
                const datePickerContainer = field.closest('.datepicker');
                if (datePickerContainer) {
                    // For DatePicker, apply error styling to the .datepicker container
                    datePickerContainer.classList.add('form-input--error');
                    if (!this.hidetext) {
                        // Check if error message already exists to prevent duplicates
                        const existingErrorMessage = datePickerContainer.nextElementSibling;
                        if (!existingErrorMessage || !existingErrorMessage.classList.contains('form-input--error--text')) {
                            const errorMessage = document.createElement('div');
                            errorMessage.className = 'form-input--error--text';
                            errorMessage.textContent = error.message;
                            datePickerContainer.parentNode.insertBefore(errorMessage, datePickerContainer.nextSibling);
                        }
                    }
                } else {
                    // Check if the field is not an input element, try to find one inside
                    const inputElements = ['INPUT', 'SELECT', 'TEXTAREA'];
                    let targetField = field;
                    if (!inputElements.includes(field.tagName)) {
                        const innerInput = field.querySelector('input, select, textarea');
                        if (innerInput) {
                            targetField = innerInput;
                        }
                    }
                    
                    targetField.classList.add('form-input--error');
                    if (!this.hidetext) {
                        // Check if error message already exists to prevent duplicates
                        const existingErrorMessage = targetField.nextElementSibling;
                        if (!existingErrorMessage || !existingErrorMessage.classList.contains('form-input--error--text')) {
                            const errorMessage = document.createElement('div');
                            errorMessage.className = 'form-input--error--text';
                            errorMessage.textContent = error.message;
                            targetField.parentNode.insertBefore(errorMessage, targetField.nextSibling);
                        }
                    }
                }
            } else {
                console.warn('Field not found for error:', error.name);
            }
        }     
        
        validate() {
            this.hidetext = this.instance.validationRules.hidetext;
            // Clear previous validation errors before validating again
            this.validationErrors = [];
            
            // Example validation logic
            for (const rule of this.instance.validationRules.rules) {
                console.log('Validating:', rule.name, ':', this.instance[rule.name]);
                if (rule.required && !this.instance[rule.name]) {
                    this.validationErrors = [...this.validationErrors, rule];
                    console.log(rule.name, 'is required');            
                }
            }
            setTimeout(() => {
                console.log("===========Validation State:", this.validationState);
            }, 100);
            if (this.validationState) {
                console.error('Validation failed:', this.validationErrors);
                return false;
            }
            console.log('Validation passed');
            return true;
        }        

    }

    class BaseClass {
        validator = null;
        validationRules = []
        isvalid = $derived(!this.validator.validationState);
        
        // validationRules = []
        // validationErrors = $state([]);

        // validationState = $derived.by(() => {
        //     console.log("Validation state derived:", this.validationErrors);
        //     let errors = JSON.parse(JSON.stringify(this.validationErrors));
        //     this.validationErrors.forEach(error => {
        //         console.error(`_________Validation error for ${error.name}: ${error.message}`);
        //         let value = this[error.name];
        //         console.log(`Value for ${error.name}:`, value);
        //         if (!value) {
        //             // remove the error from validationErrors if the value is valid
        //             // this.validationErrors = this.validationErrors.filter(e => e.name !== error.name);
        //             this.setDomError(error);
        //         } else {
        //             this.removeDomError(error);
        //             // remove from errors if the value is valid
        //             errors = errors.filter(e => e.name !== error.name);
        //         }
        //     });
        //     return errors.length > 0 ? 'error' : 'valid';
        // });

        constructor() {
            this.className = 'Base Class';
            this.validator = new Validator(this);
        }


        // removeDomError(error) {
        //     // Implement logic to remove the error visualization
        //     let form = document.querySelector(`form[name="${this.validationRules.form}"]`);
        //     if (!form) {
        //         console.error('Form not found:', this.validationRules.form);
        //         return;
        //     }
        //     // Example: Remove error class and message
        //     const field = form.querySelector(`[name="${error.name}"]`);
        //     if (field) {
        //         field.classList.remove('form-input--error');
        //         const errorMessage = field.nextElementSibling;
        //         if (errorMessage && errorMessage.classList.contains('form-input--error--text')) {
        //             errorMessage.remove();
        //         }
        //     } else {
        //         console.warn('Field not found for error:', error.name);
        //     }
        // }

        // setDomError(error) {
        //     // Impl else {
        //     // this.removeDomError(error.name);ement visualization logic here, e.g., highlight fields, show messages, etc.
        //     let form = document.querySelector(`form[name="${this.validationRules.form}"]`);
        //     if (!form) {
        //         console.error('Form not found:', this.validationRules.form);
        //         return;
        //     }
        //     // Example: Highlight fields with errors
        //     const field = form.querySelector(`[name="${error.name}"]`);
        //     if (field) {
        //         field.classList.add('form-input--error');
        //         const errorMessage = document.createElement('div');
        //         errorMessage.className = 'form-input--error--text';
        //         errorMessage.textContent = error.message;
        //         field.parentNode.insertBefore(errorMessage, field.nextSibling);
        //     } else {
        //         console.warn('Field not found for error:', error.name);
        //     }
        // }

        // validate() {
        //     // Example validation logic
        //     for (const rule of this.validationRules.rules) {
        //         console.log('Validating:', rule.name, ':', this[rule.name]);
        //         if (rule.required && !this[rule.name]) {
        //             this.validationErrors = [...this.validationErrors, rule];
        //             console.log(rule.name, 'is required');            
        //         }
        //     }
        //     if (this.validationErrors.length > 0) {
        //         return false;
        //     }
        //     return true;
        // }

        update() {
            console.log('Base Class Update called');
            if (!this.validator.validate()) return;
            console.log('Base Class Updated:');
        }
    }

    class TestClass extends BaseClass {
        name = $state('');
        option = $state('');
        select = $state('');
        date = $state('');

        validationRules = {
            form: 'testform',
            hidetext: false,
            rules: [
                {
                    name: 'name',
                    required: false,
                    message: 'Name is required'
                },
                {
                    name: 'option',
                    required: true,
                    message: 'Option is required'
                },
                {
                    name: 'select',
                    required: true,
                    message: 'Select is required'
                },
                {
                    name: 'date',
                    required: true,
                    message: 'Date is required'
                }
            ]
        }

        constructor() {
            super();
            this.className = 'Test Class';
        }
    }

    const testInstance = new TestClass();

    // $inspect(testInstance, 'testInstance');
    // $inspect(testInstance.name, 'testInstance.name');
    // $inspect(testInstance.option, 'testInstance.option');
    // $inspect(testInstance.validationRules, 'testInstance.validationRules');
    // $inspect(testInstance.validationErrors, 'testInstance.validationErrors');
    $inspect(testInstance.validator.validationState, 'testInstance.validator.validationState');

</script>

<div class="box">

    {#if testInstance.isvalid}
        <p class="text-success">Form is valid!</p>
    {:else}
        <p class="text-error">Form is invalid!</p>
    {/if}

    <Form name="testform" class="flex-column" onsubmit={() => testInstance.update()}>
        <Select bind:value={testInstance.option} name="option" size="medium" placeholder="Select an option">
            <option value="1">Test 1</option>
            <option value="2">Test 2</option>
            <option value="3">Test 3</option>
        </Select>
        <Input name="name" bind:value={testInstance.name} type="text" placeholder="Fill in your name"/>
            <Select 
                size="medium"
                name="select"
                placeholder="Start typing..."
                search
                data={[ {  "id": 1,  "name": "John Doe",  "email": "john@dummy.com",  "phone": "1234567890",  "age": 25 }, {  "id": 2,  "name": "Jane Doe",  "email": "jane@dummy.com",  "phone": "0987654321",  "age": 30 }, {  "id": 3,  "name": "Alice Smith",  "email": "alice@dummy.com",  "phone": "1122334455",  "age": 28 }, {  "id": 4,  "name": "Bob Johnson",  "email": "bob@dummy.com",  "phone": "2233445566",  "age": 35 }, {  "id": 5,  "name": "Charlie Brown",  "email": "charlie@dummy.com",  "phone": "3344556677",  "age": 40 }, {  "id": 6,  "name": "Diana Prince",  "email": "diana@dummy.com",  "phone": "4455667788",  "age": 22 }, {  "id": 7,  "name": "Evan Wright",  "email": "evan@dummy.com",  "phone": "5566778899",  "age": 27 }, {  "id": 8,  "name": "Fiona Gallagher",  "email": "fiona@dummy.com",  "phone": "6677889900",  "age": 33 }, {  "id": 9,  "name": "George King",  "email": "george@dummy.com",  "phone": "7788990011",  "age": 29 }, {  "id": 10,  "name": "Hannah Montana",  "email": "hannah@dummy.com",  "phone": "8899001122",  "age": 24 } ]}
                bind:value={testInstance.select}
            />
            <DatePicker name="date" bind:startDate={testInstance.date}  />
        <Button type="submit" color="primary" size="medium">Submit</Button>
    </Form>
</div>

<div class="flex-row">
    <InputGroup>
        <Select 
        size="medium"
        placeholder="Start typing..."
        search
        data={[ {  "id": 1,  "name": "John Doe",  "email": "john@dummy.com",  "phone": "1234567890",  "age": 25 }, {  "id": 2,  "name": "Jane Doe",  "email": "jane@dummy.com",  "phone": "0987654321",  "age": 30 }, {  "id": 3,  "name": "Alice Smith",  "email": "alice@dummy.com",  "phone": "1122334455",  "age": 28 }, {  "id": 4,  "name": "Bob Johnson",  "email": "bob@dummy.com",  "phone": "2233445566",  "age": 35 }, {  "id": 5,  "name": "Charlie Brown",  "email": "charlie@dummy.com",  "phone": "3344556677",  "age": 40 }, {  "id": 6,  "name": "Diana Prince",  "email": "diana@dummy.com",  "phone": "4455667788",  "age": 22 }, {  "id": 7,  "name": "Evan Wright",  "email": "evan@dummy.com",  "phone": "5566778899",  "age": 27 }, {  "id": 8,  "name": "Fiona Gallagher",  "email": "fiona@dummy.com",  "phone": "6677889900",  "age": 33 }, {  "id": 9,  "name": "George King",  "email": "george@dummy.com",  "phone": "7788990011",  "age": 29 }, {  "id": 10,  "name": "Hannah Montana",  "email": "hannah@dummy.com",  "phone": "8899001122",  "age": 24 } ]}
        onSelect={onSelect}
       />
            <Button size="small" square color="light">
                <Icon icon="mdi:dots-horizontal" width="18" height="18" color="var(--ar-text-color-subtle)"/>
            </Button>
            <Button size="small" square color="light">
                <Icon icon="mdi:plus" width="18" height="18" color="var(--ar-text-color-subtle)"/>
            </Button>
    </InputGroup>



</div>

<div class="flex-row">
    <InputGroup>
        <Input type="text" placeholder="Arayın" />
            <Button dropdown size="small" square color="light">
                <Icon icon="mdi:dots-horizontal" width="18" height="18" color="var(--ar-text-color-subtle)"/>
            </Button>
            <Button dropdown size="small" square color="light">
                <Icon icon="mdi:plus" width="18" height="18" color="var(--ar-text-color-subtle)"/>
            </Button>
    </InputGroup>

    
    <Input 
    placeholder="Fill in your name"
    type="text"
    size="medium"
   />

</div>
<div class="flex-row">

<DatePicker  />
<Input 
placeholder="Fill in your name"
type="text"
size="medium"
/>

</div>
