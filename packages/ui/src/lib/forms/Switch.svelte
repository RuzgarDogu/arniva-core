<script>
	/**
	 * @typedef {Object<string, any>} Props
	 * @property {any} rest
	 * @property {string} trueText
	 * @property {string} falseText
	 * @property {boolean} value
	 * @property {boolean} disabled
	 * @property {string} name
	 * @property {string} id
	 * @property {string} label
	 * @property {boolean} required
	 * @property {function} onChange
	 * @property {'default' | 'primary' | 'secondary' | 'accent' | 'warning' | 'danger' | 'succes'} color
	 * @property {boolean} reverse
	 * @property {boolean} monocolor
	 */

	let random_id = Date.now().toString(36) + Math.random().toString(36).substring(2);

	/** @type {Props} */
	let {
		trueText = '',
		falseText = '',
		value = $bindable(false),
		disabled = false,
		name = '',
		id = random_id,
		label = '',
		required = false,
		onChange,
		color = 'default',
		reverse = false,
		monocolor = true,
		...rest
	} = $props();

	/**
	 * @param {Event & { currentTarget: HTMLInputElement }} event
	 */
	function handleChange(event) {
		if (!event || !event.currentTarget) return;
		value = event.currentTarget.checked;
		if (onChange) {
			onChange(value);
		}
	}
</script>

<div
	class="switch switch--{color}"
	class:switch--reverse={reverse}
	{...rest}
	class:switch--monocolor={monocolor}
>
	{#if label}
		<label for={id} class="switch--label">{label}</label>
	{/if}
	<input
		class="switch--input"
		{id}
		type="checkbox"
		role="switch"
		aria-checked={value}
		{name}
		{disabled}
		{required}
		bind:checked={value}
		onchange={handleChange}
	/>
	<label class="switch--input-label" aria-disabled="false" for={id} aria-label="dropdown">
		<span aria-hidden="true">{falseText}</span>
		<span aria-hidden="true">{trueText}</span>
	</label>
</div>
