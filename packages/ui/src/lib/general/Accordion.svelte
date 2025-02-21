<script>
    /**
     * @typedef {Object} Props
     * @property {string} class
     * @property {boolean} multiple
     * @property {any} rest
     * @property {any} children
     */
    let id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    let { children, class:cls='', multiple=false, ...rest } = $props();


    /**
     * @param {HTMLElement} node
     */
    function handleAccordion(node) {
        console.log("node", node);
        let items = node.querySelectorAll('.accordion-item');
        items.forEach(item => {
            let header = item.querySelector('.accordion-header');
            if (header) {
                header.addEventListener('click', () => {
                    if (!multiple) {
                        items.forEach(i => i !== item && i.classList.remove('active'));
                    }
                    item.classList.toggle('active');
                });
            }
        });
    }

</script>
<div class="accordion {cls}" {...rest} id={id} use:handleAccordion>
    {@render children()}
</div>
