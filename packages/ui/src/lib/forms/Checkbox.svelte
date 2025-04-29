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
	 * @property {boolean} [inline] - Whether to display inside a table
	 * @property {boolean} [boxed] - Whether to display as a box instead of standard checkbox
	 * @property {'primary' | 'secondary' | 'default' | 'accent' | 'success' | 'danger' | 'warning'} [color]
	 * @property {string} [subtitle] - Additional descriptive text shown below the label
	 * @property {(event: Event) => void} [onchange] - Function to call when the checkbox value changes
	 */

	let random_id = Date.now().toString(36) + Math.random().toString(36).substring(2);

	/** @type {Props} */
	let {
		class: cls = '',
		label = '',
		subtitle = '',
		style = '',
		id = random_id,
		name = '',
		value,
		checked,
		color = 'default',
		boxed = false,
		onchange,
		inline = false,
		...rest
	} = $props();
</script>

<div class={['custom-checkbox', boxed ? 'custom-checkbox--boxed' : '', cls].join(' ')} {style}>
	<input type="checkbox" {id} {name} {value} {checked} {onchange} {...rest} />
	<label class={['custom-checkbox--label', `custom-checkbox--${color}`]} for={id}
	class:custom-checkbox--label-inline={inline}
	>
		{label}
		{#if subtitle && boxed}
			<span class="custom-checkbox--subtitle">{subtitle}</span>
		{/if}
	</label>
</div>
