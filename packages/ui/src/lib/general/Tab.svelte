<script>
    let random_id = Date.now().toString(36) + Math.random().toString(36).substring(2);
    let { children, right, id=random_id, ...rest } = $props();

    let activeTab = $state(0);

    function handleTab(node) {
        let items = node.querySelectorAll('.tab-item');
        let buttons = node.querySelectorAll('.tab-item-header');
        let tabsElement = node.querySelector('.tabs');
        let tabRightElement = node.querySelector('.tab-right');
        setActiveTab(activeTab);

        function setActiveTab(index) {
            activeTab = index;
            items.forEach((item) => {
                item.classList.remove('active');
            });
            items[index].classList.add('active');
            updateNodeHeight();
        }

        function updateNodeHeight() {
            let activeContent = node.querySelector('.tab-item.active .tab-item-content');
            let maxHeaderHeight = Math.max(...Array.from(buttons).map(button => button.offsetHeight));
            let contentHeight = activeContent ? activeContent.offsetHeight : 0;
            node.style.height = `${maxHeaderHeight + contentHeight}px`;

            // Set the height of .tab-right to match the height of .tabs minus 1 pixel
            if (tabRightElement && tabsElement) {
                tabRightElement.style.height = `${tabsElement.offsetHeight - 1}px`;
            }
        }

        buttons.forEach((item, index) => {
            item.addEventListener('click', () => {
                setActiveTab(index);
            });
        });

        // Initial height adjustment
        updateNodeHeight();
    }
</script>

<div class="tab" {...rest} id={id} use:handleTab>
    {#if children}
        <div class="tabs">
            {@render children?.()}
        </div>
    {/if}
    {#if right}
        <div class="tab-right">
            {@render right()}
        </div>
    {/if}
</div>