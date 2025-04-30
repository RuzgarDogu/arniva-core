<script>
	/**
	 * @typedef {Object<string, any>} Props
	 * @property {any} children
	 * @property {boolean} noBorder
	 * @property {number} [columns] Number of columns (1-5)
	 * @property {'left'|'top'} [labelPosition] Position of labels relative to inputs
	 */

	/** @type {Props} */
	let { children, noBorder=false, columns = 1, labelPosition = 'left', ...rest } = $props();
	
	// Ensure columns is within the range of 1 to 5
	columns = Math.min(Math.max(columns, 1), 5);
	const columnsClass = `form-group--columns-${columns}`;
	
	// Create a context for children to know the layout
	import { setContext } from 'svelte';
	setContext('formGroupLabelPosition', labelPosition);
	setContext('formGroupColumns', columns);
</script>

<!-- Single wrapper that works for both label positions -->
<div 
	class={`form-group ${columnsClass}`} 
	class:form-group--no-border={noBorder}
	class:form-group--labels-left={labelPosition === 'left'}
	class:form-group--labels-top={labelPosition === 'top'}
	{...rest}
>
	{#if columns === 1 && labelPosition === 'left'}
		<!-- For single column and left labels, use a single table -->
		<table class="form-group-table">
			<tbody>
				{@render children?.()}
			</tbody>
		</table>
	{:else}
		<!-- For everything else, render children directly -->
		{@render children?.()}
	{/if}
</div>
