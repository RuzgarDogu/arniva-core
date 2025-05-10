<script>
	/**
	 * @typedef {Object<string, any>} Props
	 * @property {string} class
	 * @property {boolean} multiple
	 * @property {number|string|null} openid
	 * @property {any} rest
	 * @property {any} children
	 * @property {boolean} flush
	 * @property {string} id
	 */
	let random_id = Date.now().toString(36) + Math.random().toString(36).substring(2);

	/** @type {Props} */
	let {
		openid = $bindable(),
		children,
		class: cls = '',
		flush = false,
		multiple = false,
		id = random_id,
		...rest
	} = $props();

	/**
	 * @param {HTMLElement} node
	 */
	function handleAccordion(node) {
		let items = node.querySelectorAll('.accordion-item');
		items.forEach((item) => {
			let header = item.querySelector('.accordion-header');
			if (header) {
				header.addEventListener('click', () => {
					if (!multiple) {
						items.forEach((i) => i !== item && i.classList.remove('active'));
					}
					item.classList.toggle('active');
				});
			}
		});
	}

	/** @type {HTMLDivElement|null} */
	let accordionContainer;
	// $inspect("openAccordionId", openid);

	$effect(() => {
		console.log('openAccordionId', openid);
		if (openid && accordionContainer) {
			let items = accordionContainer.querySelectorAll('.accordion-item');
			items.forEach((item) => {
				console.log('item.id', item.id);
				if (item.id == openid) {
					item.classList.add('active');
				} else {
					item.classList.remove('active');
				}
			});
		}
	})

</script>

<div class="accordion {cls}" {...rest} {id} use:handleAccordion class:flush bind:this={accordionContainer}>
	{@render children()}
</div>
