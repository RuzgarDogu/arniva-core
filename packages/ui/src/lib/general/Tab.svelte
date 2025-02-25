<script>
	/**
	 * @typedef {Object<string, any>} Props
	 * @property {any} [children] The tab contents
	 * @property {any} [right] The right side of the tab
	 * @property {string} [id] The tab id
	 * @property {any} rest The tab props
	 */
	let random_id = Date.now().toString(36) + Math.random().toString(36).substring(2);

	/** @type {Props} */
	let { children, right, id = random_id, ...rest } = $props();

	let activeTab = $state(0);

	/**
	 * @param {HTMLElement} node
	 */
	function handleTab(node) {
		let items = node.querySelectorAll('.tab-item');
		/**
		 * @type {NodeListOf<HTMLElement>}
		 */
		let buttons = node.querySelectorAll('.tab-item-header');
		/**
		 * @type {HTMLElement | null}
		 */
		let tabsElement = node.querySelector('.tabs');
		/**
		 * @type {HTMLElement | null}
		 */
		let tabRightElement = node.querySelector('.tab-right');
		setActiveTab(activeTab);

		/**
		 * @param {number} index - The index of the tab to activate
		 */
		function setActiveTab(index) {
			activeTab = index;
			items.forEach((item) => {
				item.classList.remove('active');
			});
			items[index].classList.add('active');
			updateNodeHeight();
		}

		function updateNodeHeight() {
			/**
			 * @type {HTMLElement | null}
			 */
			let activeContent = node.querySelector('.tab-item.active .tab-item-content');
			let maxHeaderHeight = Math.max(...Array.from(buttons).map((button) => button.offsetHeight));
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

<div class="tab" {...rest} {id} use:handleTab>
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
