<script>
	/**
	 * @typedef {Object} Props
	 * @property {boolean} [disabled] Is the button disabled?
	 * @property {boolean} [link] Is this the principal call to action on the page?
	 * @property {string} [backgroundColor] What background color to use
	 * @property {'small' | 'medium' | 'large'} [size] How large should the button be?
	 * @property {string} [label] Button contents
	 * @property {'button' | 'submit' | 'reset'} [type] The type of button
	 * @property {'primary' | 'secondary' | 'transparent' | 'accent' | 'danger' | 'success' | 'default' | 'warning' | 'light' } [color] The color of the button
	 * @property {string} [url] The URL the button should link to
	 * @property {boolean} [dropdown] Is this a dropdown button?
	 * @property {boolean} [list] Is this a list button?
	 * @property {boolean} [noPadding] Should the button have padding?
	 * @property {boolean} [square] Should the button be square?
	 * @property {boolean} [thin] Should the button be thin?
	 * @property {any} [children] The button contents
	 * @property {string} [class] The class to add to the button
	 * @property {string} [id] The class to add to the button
	 * @property {string} [style] The style to add to the button
	 * @property {string} [modal] The modal to open
	 * @property {boolean} [modalEnlarge] Should the modal be enlarged?
	 * @property {boolean} [modalDismiss] Should the modal be dismissed?
	 * @property {boolean} [autoWidth] Should the button have auto width?
	 * @property {boolean} [rounded] Should the button have auto width?
	 * @property {number} [tabindex] The tabindex of the button
	 * @property {() => void} [onClick] The onclick event handler
	 */

	/** @type {Props} */
	let {
		children,
		style = '',
		class: cls = '',
		id = '',
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
		square = false,
		modal = '',
		modalEnlarge = false,
		modalDismiss = false,
		autoWidth = false,
		rounded = false,
		disabled = false,
		tabindex = 0
	} = $props();
</script>

{#if link}
	<a
		{id}
		{tabindex}
		href={url}
		class:button--auto-width={autoWidth}
		class:button--link={link}
		class={['button', `${cls}`, `button--${size}`, `button--${color}`].join(' ')}
		class:button--dropdown={dropdown}
		class:button--list={list}
		class:button--no-padding={noPadding}
		class:button--square={square}
		class:button--thin={thin}
		class:button--rounded={rounded}
		style:background-color={backgroundColor}
		{style}
	>
		{#if children}
			{@render children()}
		{:else}
			{label}
		{/if}
	</a>
{:else}
	<button
		{tabindex}
		{id}
		{type}
		class:button--auto-width={autoWidth}
		class={['button', `${cls}`, `button--${size}`, `button--${color}`].join(' ')}
		class:button--dropdown={dropdown}
		class:button--list={list}
		class:button--no-padding={noPadding}
		class:button--square={square}
		class:button--thin={thin}
		class:button--disabled={disabled}
		style:background-color={backgroundColor}
		{style}
		{disabled}
		onclick={onClick}
		data-ar-toggle={modal ? 'modal' : null}
		data-ar-target={modal ? modal : null}
		data-ar-enlarge={modalEnlarge ? 'modal' : null}
		data-ar-dismiss={modalDismiss ? 'modal' : null}
	>
		{#if children}
			{@render children()}
		{:else}
			{label}
		{/if}
	</button>
{/if}
