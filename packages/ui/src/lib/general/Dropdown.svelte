<script>
    let random_id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    let { children, id=random_id, ...rest } = $props();
    /** @type {HTMLElement | null} */
    let currentOpenDropdown = null;

    /**
     * @param {HTMLElement} node
     */
    function handleDropdown(node) {
        const button = /** @type {HTMLElement} */ (node.querySelector('.button--dropdown'));
        const dropdownContent = /** @type {HTMLElement | null} */ (node.querySelector('.dropdown-content'));
    
        function toggleDropdown() {
            if (currentOpenDropdown && currentOpenDropdown !== node) {
                closeDropdown(new Event('click', { bubbles: true, cancelable: true }));
            }

            node.classList.toggle('open');
            if (node.classList.contains('open')) {
                currentOpenDropdown = node;
                adjustDropdownPosition();
                window.addEventListener('scroll', adjustDropdownPosition, true);
            } else {
                closeDropdown(new Event('click', { bubbles: true, cancelable: true }));
            }
        }
    
        /**
         * @param {Event} event
         */
        function closeDropdown(event) {
            if (!node.contains(/** @type {Node} */ (event.target))) {
                node.classList.remove('open');
                if (dropdownContent) {
                    dropdownContent.style.display = 'none';
                    dropdownContent.style.visibility = 'hidden';
                }
                window.removeEventListener('scroll', adjustDropdownPosition, true);
                currentOpenDropdown = null;
            }
        }
    
        function adjustDropdownPosition() {
            if (!dropdownContent) return;

            dropdownContent.style.display = 'block';
            dropdownContent.style.visibility = 'hidden';
    
            const buttonRect = button.getBoundingClientRect();
            const dropdownRect = dropdownContent.getBoundingClientRect();
            const availableSpaceBelow = window.innerHeight - buttonRect.bottom;
            const availableSpaceRight = window.innerWidth - buttonRect.right;
    
            dropdownContent.style.position = 'fixed';
    
            if (availableSpaceBelow < dropdownRect.height) {
                dropdownContent.style.top = `${buttonRect.top - dropdownRect.height}px`;
            } else {
                dropdownContent.style.top = `${buttonRect.bottom}px`;
            }
    
            if (availableSpaceRight < dropdownRect.width) {
                dropdownContent.style.left = `${buttonRect.right - dropdownRect.width}px`;
            } else {
                dropdownContent.style.left = `${buttonRect.left}px`;
            }
    
            dropdownContent.style.visibility = 'visible';
        }
    
        button.addEventListener('click', toggleDropdown);
        document.addEventListener('click', closeDropdown);
    }
</script>

<div class="dropdown" id={id} {...rest} use:handleDropdown>
    {@render children?.()}
</div>