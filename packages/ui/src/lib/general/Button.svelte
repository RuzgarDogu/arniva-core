<script>
	/**
	 * @typedef {Object} Props
	 * @property {boolean} [link] Is this the principal call to action on the page?
	 * @property {string} [backgroundColor] What background color to use
	 * @property {'small' | 'medium' | 'large'} [size] How large should the button be?
	 * @property {string} [label] Button contents
	 * @property {'button' | 'submit' | 'reset'} [type] The type of button
	 * @property {'primary' | 'secondary' | 'transparent' | 'accent' | 'danger' | 'success' | 'default'} [color] The color of the button
	 * @property {string} [url] The URL the button should link to
	 * @property {boolean} [dropdown] Is this a dropdown button?
	 * @property {boolean} [list] Is this a list button?
	 * @property {boolean} [noPadding] Should the button have padding?
	 * @property {boolean} [square] Should the button be square?
	 * @property {boolean} [thin] Should the button be thin?
	 * @property {any} [children] The button contents
	 * @property {string} [class] The class to add to the button
	 * @property {() => void} [onClick] The onclick event handler
	 */

	/** @type {Props} */
	let {
		children,
		class: cls = '',
		link = false,
		thin = false,
		url = '#',
		color = 'default',
		backgroundColor,
		size = 'medium',
		label = '',
		onClick,
		type = 'button',
		dropdown = false,
		list = false,
		noPadding = false,
		square = false
	} = $props();
</script>

{#if link}
	<a
		href={url}
		class:button--link={link}
		class={['button', `${cls}`, `button--${size}`, `button--${color}`].join(' ')}
		class:button--dropdown={dropdown}
		class:button--list={list}
		class:button--no-padding={noPadding}
		class:button--square={square}
		class:button--thin={thin}
		style:background-color={backgroundColor}
	>
		{#if children}
			{@render children()}
		{:else}
			{label}
		{/if}
	</a>
{:else}
	<button
		{type}
		class={['button', `${cls}`, `button--${size}`, `button--${color}`].join(' ')}
		class:button--dropdown={dropdown}
		class:button--list={list}
		class:button--no-padding={noPadding}
		class:button--square={square}
		class:button--thin={thin}
		style:background-color={backgroundColor}
		onclick={onClick}
	>
		{#if children}
			{@render children()}
		{:else}
			{label}
		{/if}
	</button>
{/if}
