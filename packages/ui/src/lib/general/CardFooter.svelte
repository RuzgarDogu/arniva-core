<script>
	/**
	 * @typedef {Object} Props
	 * @property {string} [class] Custom class
	 * @property {any} [children] The card contents
     * @property {string} [title] The card title
     * @property {boolean} [border] The card border
     * @property {'default' | 'primary' | 'accent' | 'secondary'} [color] The card color
	 */

	/** @type {Props} */
	let { children, class: cls = '', title='', border=false, color='default' } = $props();
</script>

<div 
class={['card--footer', `${cls}`, `card--footer-${color}`].join(' ')}
class:card--footer-border={border}
>
    {#if title}
        <div class="card--title">{title}</div>
    {/if}
	{@render children?.()}
</div>
